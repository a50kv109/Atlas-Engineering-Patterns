/**
 * Atlas Engineering Patterns — Deterministic Stand Solution Composition & Retrieval Engine
 * Strictly rule-based, traceable, and honest about knowledge gaps.
 */

import {
  StandRequirementQuery,
  ComposedStandSolution,
  PatternEntity,
  PrimitiveEntity,
  EvidenceEntity
} from './types';
import { KnowledgeGraph } from './graphEngine';
import { ALL_CANONICAL_ENTITIES } from './canonicalData';

export class RetrievalEngine {
  private graph: KnowledgeGraph;

  constructor(graph?: KnowledgeGraph) {
    this.graph = graph || new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  }

  public composeSolution(query: StandRequirementQuery): ComposedStandSolution {
    const allPatterns = ALL_CANONICAL_ENTITIES.filter((e): e is PatternEntity => e.type === 'pattern');
    const allPrimitives = ALL_CANONICAL_ENTITIES.filter((e): e is PrimitiveEntity => e.type === 'primitive');
    const allEvidence = ALL_CANONICAL_ENTITIES.filter((e): e is EvidenceEntity => e.type === 'evidence');

    const matchedPatterns: ComposedStandSolution['matchedPatterns'] = [];
    const matchedPrimitivesMap = new Map<string, { primitive: PrimitiveEntity; parentPatternId?: string; slot: string }>();
    const knowledgeGaps: ComposedStandSolution['knowledgeGaps'] = [];

    // 1. Process capabilities & hard constraints
    const requiredCapsNormalized = query.requiredCapabilities.map(c => c.toLowerCase().trim());
    const queryPeripheralsNormalized = query.peripherals.map(p => p.toLowerCase().trim());

    // Evaluate each pattern for applicability & constraints
    const candidateRankings: {
      pattern: PatternEntity;
      score: number;
      reasons: string[];
      hardConstraintViolated: boolean;
      violationReason?: string;
    }[] = [];

    for (const pattern of allPatterns) {
      let score = 0;
      const reasons: string[] = [];
      let hardConstraintViolated = false;
      let violationReason: string | undefined = undefined;

      // Check Purpose applicability
      if (pattern.applicability.purposes.includes(query.purpose)) {
        score += 25;
        reasons.push(`Directly targets stand purpose '${query.purpose}'`);
      } else {
        // Soft penalty or check if flexible
        score -= 10;
      }

      // Check User Level applicability
      if (pattern.applicability.targetLevels.includes(query.userLevel)) {
        score += 20;
        reasons.push(`Tailored for user knowledge level '${query.userLevel}'`);
      } else {
        // Hard constraint check: secondary school students cannot use high-hazard unconstrained patterns
        if (query.userLevel === 'SECONDARY_SCHOOL' && !pattern.applicability.targetLevels.includes('SECONDARY_SCHOOL')) {
          hardConstraintViolated = true;
          violationReason = `Pattern not certified for secondary school learners (requires ${pattern.applicability.targetLevels.join(', ')})`;
        } else if (query.userLevel === 'CERTIFIED_OPERATOR' && pattern.id === 'pat-guided-student-experiment-stepper') {
          score -= 15;
          reasons.push('Pedagogical step-gating is generally redundant for certified operators');
        }
      }

      // Check Screen Count constraint
      if (pattern.applicability.minScreens > query.screensCount) {
        hardConstraintViolated = true;
        violationReason = `Requires at least ${pattern.applicability.minScreens} monitors (stand has only ${query.screensCount})`;
      }

      // Match Required Capabilities against pattern tags, problem, domainCategory
      for (const reqCap of requiredCapsNormalized) {
        const matchesTag = pattern.tags.some(t => t.toLowerCase().includes(reqCap) || reqCap.includes(t.toLowerCase()));
        const matchesDomain = pattern.domainCategory.toLowerCase().includes(reqCap) || reqCap.includes(pattern.domainCategory.toLowerCase());
        const matchesText = pattern.shortDescription.toLowerCase().includes(reqCap) || pattern.problemStatement.toLowerCase().includes(reqCap);

        if (matchesTag || matchesDomain || matchesText) {
          score += 30;
          reasons.push(`Fulfills capability requirement '${reqCap}'`);
        }
      }

      // Match Peripherals
      if (pattern.applicability.requiredPeripherals) {
        for (const reqPeriph of pattern.applicability.requiredPeripherals) {
          const hasPeriph = queryPeripheralsNormalized.some(p => p.includes(reqPeriph.toLowerCase()) || reqPeriph.toLowerCase().includes(p));
          if (!hasPeriph) {
            // Check if it's strict
            if (pattern.id === 'pat-dual-operator-safety-interlock' || pattern.id === 'pat-multi-screen-overview-detailed-drilldown') {
              hardConstraintViolated = true;
              violationReason = `Missing required physical hardware/peripheral: '${reqPeriph}'`;
            }
          }
        }
      }

      candidateRankings.push({
        pattern,
        score,
        reasons,
        hardConstraintViolated,
        violationReason
      });
    }

    // Sort by score descending
    candidateRankings.sort((a, b) => b.score - a.score);

    // Filter valid patterns (score > 15 and not violated)
    const acceptedPatterns: PatternEntity[] = [];
    const selectedPatternIds = new Set<string>();

    for (const candidate of candidateRankings) {
      if (candidate.hardConstraintViolated) {
        continue;
      }
      if (candidate.score < 20) {
        continue;
      }

      // Check conflicts with already accepted patterns
      let hasConflict = false;
      for (const accepted of acceptedPatterns) {
        const conflictsWithAccepted =
          (candidate.pattern.conflictPatternIds && candidate.pattern.conflictPatternIds.includes(accepted.id)) ||
          (accepted.conflictPatternIds && accepted.conflictPatternIds.includes(candidate.pattern.id));

        if (conflictsWithAccepted) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        acceptedPatterns.push(candidate.pattern);
        selectedPatternIds.add(candidate.pattern.id);

        // Find alternatives for this pattern
        const alternatives: PatternEntity[] = [];
        if (candidate.pattern.alternativePatternIds) {
          for (const altId of candidate.pattern.alternativePatternIds) {
            const altPat = allPatterns.find(p => p.id === altId);
            if (altPat) alternatives.push(altPat);
          }
        }

        // Find supporting evidence
        const supportingEvidence: EvidenceEntity[] = [];
        for (const evId of candidate.pattern.evidenceIds) {
          const ev = allEvidence.find(e => e.id === evId);
          if (ev) supportingEvidence.push(ev);
        }

        matchedPatterns.push({
          pattern: candidate.pattern,
          selectionReason: candidate.reasons.join('; '),
          evidenceStatus: candidate.pattern.lifecycleStatus,
          supportingEvidence,
          alternatives
        });

        // Expand to pattern primitives via USES
        for (const primId of candidate.pattern.primitiveIds) {
          const prim = allPrimitives.find(p => p.id === primId);
          if (prim && !matchedPrimitivesMap.has(prim.id)) {
            matchedPrimitivesMap.set(prim.id, {
              primitive: prim,
              parentPatternId: candidate.pattern.id,
              slot: prim.uiSlot
            });
          }
        }
      }
    }

    // Detect Active Conflicts in graph for selected nodes
    const allSelectedIds = [...selectedPatternIds, ...Array.from(matchedPrimitivesMap.keys())];
    const activeConflicts = this.graph.detectConflicts(allSelectedIds);

    // Knowledge Gap Detection:
    // Check if any explicitly required capability was left completely unfulfilled
    for (const reqCap of requiredCapsNormalized) {
      let isFulfilled = false;

      // Check matched patterns
      for (const mp of matchedPatterns) {
        const matchesTag = mp.pattern.tags.some(t => t.toLowerCase() === reqCap || t.toLowerCase().includes(reqCap));
        const matchesText = mp.pattern.title.toLowerCase().includes(reqCap) || mp.pattern.shortDescription.toLowerCase().includes(reqCap);
        if (matchesTag || matchesText) {
          isFulfilled = true;
          break;
        }
      }

      // Check matched primitives
      if (!isFulfilled) {
        for (const mp of matchedPrimitivesMap.values()) {
          const matchesTag = mp.primitive.tags.some(t => t.toLowerCase() === reqCap || t.toLowerCase().includes(reqCap));
          const matchesText = mp.primitive.title.toLowerCase().includes(reqCap) || mp.primitive.shortDescription.toLowerCase().includes(reqCap);
          if (matchesTag || matchesText) {
            isFulfilled = true;
            break;
          }
        }
      }

      if (!isFulfilled) {
        knowledgeGaps.push({
          unmetRequirement: reqCap,
          reason: `No canonical pattern or construction primitive in the repository satisfies '${reqCap}' under current constraints (${query.purpose}, ${query.userLevel}, ${query.screensCount} screen(s)).`,
          recommendation: `Submit a candidate pattern or primitive proposal to the Atlas ingestion pipeline targeting '${reqCap}'. Do not fabricate non-canonical components.`
        });
      }
    }

    // Build traceable layout blueprint
    const matchedPrimitives = Array.from(matchedPrimitivesMap.values());
    const layoutZones: ComposedStandSolution['blueprint']['zones'] = [
      {
        name: 'Top Header & Safety Ribbon',
        role: 'Permanent safety state, system status, emergency disarm interlocks',
        assignedEntities: matchedPrimitives.filter(p => p.primitive.uiSlot === 'ribbon').map(p => p.primitive.id)
      },
      {
        name: 'Left Parameter & Control Rail',
        role: 'Physical parameter inputs, steppers, scrubbers, protocol controls',
        assignedEntities: matchedPrimitives.filter(p => p.primitive.uiSlot === 'control-rail').map(p => p.primitive.id)
      },
      {
        name: 'Center High-Fidelity Inspection Stage',
        role: '2D/3D spatial crosshair canvas, polar gauge cluster, active plant state',
        assignedEntities: matchedPrimitives.filter(p => p.primitive.uiSlot === 'viewport').map(p => p.primitive.id)
      },
      {
        name: 'Bottom Multi-Channel Telemetry Tray',
        role: 'Hardware-synchronized time-series waveform strips, annunciator matrix',
        assignedEntities: matchedPrimitives.filter(p => p.primitive.uiSlot === 'strip' || p.primitive.uiSlot === 'matrix').map(p => p.primitive.id)
      }
    ];

    const totalEntitiesUsed = matchedPatterns.length + matchedPrimitives.length;
    const verifiedEntitiesCount =
      matchedPatterns.filter(p => ['INDEPENDENTLY_VERIFIED', 'MEASURED', 'TESTED'].includes(p.evidenceStatus)).length +
      matchedPrimitives.filter(p => ['INDEPENDENTLY_VERIFIED', 'MEASURED', 'TESTED'].includes(p.primitive.lifecycleStatus)).length;

    const evidenceBackingPercent = totalEntitiesUsed > 0 ? Math.round((verifiedEntitiesCount / totalEntitiesUsed) * 100) : 0;

    return {
      query,
      matchedPatterns,
      matchedPrimitives,
      activeConflicts,
      knowledgeGaps,
      traceabilityManifest: {
        totalEntitiesUsed,
        evidenceBackingPercent,
        hardConstraintsSatisfied: candidateRankings.every(c => !c.hardConstraintViolated || !selectedPatternIds.has(c.pattern.id))
      },
      blueprint: {
        layoutType: query.screensCount > 1 ? 'multi-monitor-sync' : 'asymmetric-split',
        zones: layoutZones
      }
    };
  }
}
