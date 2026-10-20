/**
 * Atlas Engineering Patterns — Deterministic Stand Solution Composition & Retrieval Engine
 * Strictly rule-based, traceable, and honest about knowledge gaps.
 */

import {
  StandRequirementQuery,
  ComposedStandSolution,
  PatternEntity,
  PrimitiveEntity,
  EvidenceEntity,
  CompatibilityResult,
  NhfgPatternGuidance,
  NhfgGuidanceSummary
} from './types';
import { KnowledgeGraph } from './graphEngine';
import { ALL_CANONICAL_ENTITIES } from './canonicalData';
import { NhfgEngine } from './nhfgEngine';

export class RetrievalEngine {
  private graph: KnowledgeGraph;
  private nhfgEngine: NhfgEngine;

  constructor(graph?: KnowledgeGraph, nhfgEngine?: NhfgEngine) {
    this.graph = graph || new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
    this.nhfgEngine = nhfgEngine || new NhfgEngine();
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

        // Trace applicable NHFG normative guidance
        const patternGuidance = this.nhfgEngine.traceChain(candidate.pattern.id);
        const nhfgGuidance: NhfgPatternGuidance[] = patternGuidance.map(link => {
          const missingEvidence: string[] = [];
          if (link.mapping.status.scenarioVerificationStatus === 'NOT_ASSESSED') {
            missingEvidence.push('No automated scenario verification executed for this mapping.');
          }
          if (link.mapping.status.userEvaluationStatus === 'NOT_ASSESSED') {
            missingEvidence.push('No empirical trials with representative human operators recorded.');
          }
          if (link.mapping.status.conformanceStatus === 'CONFORMANCE_NOT_ESTABLISHED') {
            missingEvidence.push('Standard conformance in accordance with formal evaluation procedures is not established.');
          }

          return {
            source: {
              id: link.source.id,
              standard: link.source.standard,
              title: link.source.title,
              officialUrl: link.source.officialUrl,
              publicationDate: link.source.publicationDate,
              confirmedDate: link.source.confirmedDate,
              atlasVerifiedDate: link.source.atlasVerifiedDate
            },
            principle: {
              id: link.principle.id,
              title: link.principle.title,
              sectionRef: link.principle.sectionRef,
              conciseSummary: link.principle.conciseSummary
            },
            requirement: link.requirement
              ? {
                  id: link.requirement.id,
                  statement: link.requirement.statement,
                  requirementType: link.requirement.requirementType,
                  safetyCritical: link.requirement.safetyCritical
                }
              : undefined,
            mappingId: link.mapping.id,
            rationale: link.mapping.rationale,
            epistemicCategory: link.mapping.epistemicCategory,
            status: link.mapping.status,
            applicabilityConditions: link.mapping.applicabilityConditions,
            knownLimitations: link.mapping.knownLimitations,
            missingEvidence
          };
        });

        matchedPatterns.push({
          pattern: candidate.pattern,
          selectionReason: candidate.reasons.join('; '),
          evidenceStatus: candidate.pattern.lifecycleStatus,
          supportingEvidence,
          alternatives,
          nhfgGuidance: nhfgGuidance.length > 0 ? nhfgGuidance : undefined
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

    // Knowledge Gap & Epistemic Requirement Verification:
    // Check if required capabilities have verified coverage vs heuristic-only match vs unmet requirement.
    const heuristicMatchesOnly: string[] = [];

    for (const reqCap of requiredCapsNormalized) {
      let isFulfilled = false;
      let hasVerifiedCoverage = false;

      // Check matched patterns
      for (const mp of matchedPatterns) {
        const matchesTag = mp.pattern.tags.some(t => t.toLowerCase() === reqCap || t.toLowerCase().includes(reqCap));
        const matchesText = mp.pattern.title.toLowerCase().includes(reqCap) || mp.pattern.shortDescription.toLowerCase().includes(reqCap) || mp.pattern.problemStatement.toLowerCase().includes(reqCap);
        if (matchesTag || matchesText) {
          isFulfilled = true;
          const isVerified = ['INDEPENDENTLY_VERIFIED', 'MEASURED', 'TESTED'].includes(mp.evidenceStatus) || mp.pattern.evidenceIds.length > 0;
          if (isVerified) {
            hasVerifiedCoverage = true;
          }
        }
      }

      // Check matched primitives
      if (!isFulfilled || !hasVerifiedCoverage) {
        for (const mp of matchedPrimitivesMap.values()) {
          const matchesTag = mp.primitive.tags.some(t => t.toLowerCase() === reqCap || t.toLowerCase().includes(reqCap));
          const matchesText = mp.primitive.title.toLowerCase().includes(reqCap) || mp.primitive.shortDescription.toLowerCase().includes(reqCap);
          if (matchesTag || matchesText) {
            isFulfilled = true;
            const isVerified = ['INDEPENDENTLY_VERIFIED', 'MEASURED', 'TESTED'].includes(mp.primitive.lifecycleStatus) || mp.primitive.evidenceIds.length > 0;
            if (isVerified) {
              hasVerifiedCoverage = true;
            }
          }
        }
      }

      if (!isFulfilled) {
        knowledgeGaps.push({
          unmetRequirement: reqCap,
          reason: `No canonical pattern or construction primitive in the repository satisfies '${reqCap}' under current constraints (${query.purpose}, ${query.userLevel}, ${query.screensCount} screen(s)).`,
          recommendation: `Submit a candidate pattern or primitive proposal to the Atlas ingestion pipeline targeting '${reqCap}'. Do not fabricate non-canonical components.`
        });
      } else if (!hasVerifiedCoverage) {
        heuristicMatchesOnly.push(reqCap);
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

    const lossLog: ComposedStandSolution['lossLog'] = [];

    // Register unmet requirements as loss items
    for (const gap of knowledgeGaps) {
      lossLog.push({
        type: 'UNMET_REQUIREMENT',
        requirementId: gap.unmetRequirement,
        reason: gap.reason
      });
    }

    // Register heuristic-only matches as loss items (HEURISTIC_MATCH_ONLY)
    for (const reqCap of heuristicMatchesOnly) {
      lossLog.push({
        type: 'HEURISTIC_MATCH_ONLY',
        requirementId: reqCap,
        reason: `Capability requirement '${reqCap}' matched only via heuristic tag/text without formal verified evidence backing (HEURISTIC_MATCH_ONLY).`
      });
    }

    // Register excluded candidates (hard constraint violations or score < 20)
    for (const candidate of candidateRankings) {
      if (candidate.hardConstraintViolated || candidate.score < 20) {
        lossLog.push({
          type: 'EXCLUDED_CANDIDATE',
          entityId: candidate.pattern.id,
          reason: candidate.violationReason || `Excluded due to score ${candidate.score} (< 20) or conflict/applicability mismatch`
        });
      }
    }

    const compatibilityIssues: ComposedStandSolution['compatibilityIssues'] = [];
    for (const [primId, data] of matchedPrimitivesMap) {
      if (data.parentPatternId) {
        const pattern = allPatterns.find(p => p.id === data.parentPatternId);
        const primitive = data.primitive;
        if (pattern && primitive) {
          const res = this.graph.checkCompatibility(pattern, primitive);
          if (res !== 'COMPATIBLE') {
            compatibilityIssues.push({
              entityA: pattern.id,
              entityB: primitive.id,
              result: res,
              reason: res === 'INCOMPATIBLE' ? 'Port type mismatch' : 'Contract missing'
            });
            lossLog.push({
              type: 'UNVERIFIED_CONNECTION',
              entityId: primitive.id,
              reason: res === 'INCOMPATIBLE' ? `Technical incompatibility with ${pattern.id}` : `Contract missing for ${primitive.id}`
            });
          }
        }
      }
    }

    const validationStatus = this.calculateValidationStatus(
      compatibilityIssues,
      matchedPrimitivesMap.size,
      knowledgeGaps.length,
      activeConflicts.length,
      heuristicMatchesOnly.length
    );

    // Compute NHFG Summary across all matched patterns
    let totalNormativeMappings = 0;
    const principlesCoveredSet = new Set<string>();
    let unverifiedMappingsCount = 0;
    let hypothesisMappingsCount = 0;
    let verifiedScenariosCount = 0;
    let conformanceClaimedCount = 0;

    for (const mp of matchedPatterns) {
      if (mp.nhfgGuidance) {
        for (const g of mp.nhfgGuidance) {
          totalNormativeMappings++;
          principlesCoveredSet.add(g.principle.title);
          if (g.status.scenarioVerificationStatus === 'NOT_ASSESSED') {
            unverifiedMappingsCount++;
          } else if (g.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED') {
            verifiedScenariosCount++;
          }
          if (g.epistemicCategory === 'DESIGN_HYPOTHESIS') {
            hypothesisMappingsCount++;
          }
          if (g.status.conformanceStatus === 'CONFORMANCE_CLAIMED') {
            conformanceClaimedCount++;
          }
        }
      }
    }

    const nhfgSummary: NhfgGuidanceSummary | undefined =
      totalNormativeMappings > 0
        ? {
            totalNormativeMappings,
            principlesCovered: Array.from(principlesCoveredSet),
            unverifiedMappingsCount,
            hypothesisMappingsCount,
            verifiedScenariosCount,
            conformanceClaimedCount,
            conformanceDisclaimers: [
              'Normative guidance links provide ergonomic design rationale, not formal certification.',
              'Automated scenario tests verify simulation assertions only; full usability requires operator trials.',
              'Standard conformance remains CONFORMANCE_NOT_ESTABLISHED until formal evaluation procedures are conducted.'
            ]
          }
        : undefined;

    const epistemicProvenance: ComposedStandSolution['epistemicProvenance'] = [
      {
        statement: `Evidence backing level stands at ${evidenceBackingPercent}% across ${totalEntitiesUsed} matched entities.`,
        status: evidenceBackingPercent > 50 ? 'OBSERVED_EVIDENCE' : 'INFERRED'
      },
      {
        statement: 'Verification scope is strictly limited to matched pattern-primitive USES pairs rather than full port graph.',
        status: 'INFERRED'
      }
    ];

    if (activeConflicts.length > 0) {
      epistemicProvenance.push({
        statement: `Detected ${activeConflicts.length} active epistemic/structural conflict(s) among selected entities.`,
        status: 'CONFLICT'
      });
    }

    if (nhfgSummary && nhfgSummary.totalNormativeMappings > 0) {
      epistemicProvenance.push({
        statement: `NHFG normative guidance attached across ${nhfgSummary.totalNormativeMappings} mapping(s) covering ${nhfgSummary.principlesCovered.length} interaction principle(s). Standard conformance remains unestablished.`,
        status: 'INFERRED'
      });
    }

    // Explicitly record design hypotheses in epistemic provenance
    for (const mp of matchedPatterns) {
      if (mp.nhfgGuidance) {
        for (const g of mp.nhfgGuidance) {
          if (g.epistemicCategory === 'DESIGN_HYPOTHESIS') {
            epistemicProvenance.push({
              statement: `Pattern '${mp.pattern.id}' is linked to principle '${g.principle.title}' strictly as a DESIGN_HYPOTHESIS awaiting empirical trials.`,
              status: 'UNKNOWN'
            });
          }
        }
      }
    }

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
      },
      compatibilityIssues,
      validationStatus,
      epistemicProvenance,
      lossLog,
      nhfgSummary
    };
  }

  private calculateValidationStatus(
    compatibilityIssues: { result: CompatibilityResult }[],
    totalChecked: number,
    knowledgeGapsCount: number,
    activeConflictsCount: number,
    heuristicMatchesOnlyCount: number
  ): 'COMPATIBLE' | 'INCOMPATIBLE' | 'UNVERIFIED' {
    if (totalChecked === 0 && knowledgeGapsCount > 0) return 'UNVERIFIED';

    const hasIncompatible = compatibilityIssues.some(issue => issue.result === 'INCOMPATIBLE');
    if (hasIncompatible) return 'INCOMPATIBLE';

    const hasUnknown = compatibilityIssues.some(issue => issue.result === 'UNKNOWN');
    if (hasUnknown || knowledgeGapsCount > 0 || activeConflictsCount > 0 || heuristicMatchesOnlyCount > 0) {
      return 'UNVERIFIED';
    }

    return totalChecked > 0 ? 'COMPATIBLE' : 'UNVERIFIED';
  }
}

