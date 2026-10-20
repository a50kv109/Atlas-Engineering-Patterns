/**
 * Atlas Engineering Patterns — Normative & Human Factors Guidance (NHFG) Engine
 * Querying, Traceability, and Registry Validation.
 */

import {
  SourceRecord,
  PrincipleRecord,
  RequirementRecord,
  PatternMapping,
  VerificationRecord,
  MappingStatusModel,
  NhfgRegistryValidationReport,
  PatternEntity
} from './types';
import {
  NHFG_SOURCES,
  NHFG_PRINCIPLES,
  NHFG_REQUIREMENTS,
  NHFG_PATTERN_MAPPINGS,
  NHFG_VERIFICATIONS
} from './nhfgData';

/**
 * Validates orthogonal mapping status consistency.
 * Prevents false claims of standard conformance.
 */
export function validateMappingStatus(status: MappingStatusModel): { valid: boolean; error?: string } {
  if (status.conformanceStatus === 'CONFORMANCE_CLAIMED') {
    if (!status.conformanceMethod || status.conformanceMethod === 'NONE') {
      return {
        valid: false,
        error: 'Standard conformance claim requires an explicit evaluation method (e.g. self-assessment, 2nd party audit, or 3rd party certification).'
      };
    }
    if (status.scenarioVerificationStatus !== 'SCENARIO_VERIFIED') {
      return {
        valid: false,
        error: 'Standard conformance cannot be claimed without verified scenario evidence.'
      };
    }
    if (status.designRationaleStatus !== 'DESIGN_RATIONALE_PROVIDED') {
      return {
        valid: false,
        error: 'Standard conformance cannot be claimed without a documented design rationale.'
      };
    }
  }

  if (status.scenarioVerificationStatus === 'SCENARIO_VERIFIED' && status.designRationaleStatus === 'NOT_ASSESSED') {
    return {
      valid: false,
      error: 'Cannot have a verified scenario without an assessed design rationale.'
    };
  }

  return { valid: true };
}

export class NhfgEngine {
  private sources: Map<string, SourceRecord> = new Map();
  private principles: Map<string, PrincipleRecord> = new Map();
  private requirements: Map<string, RequirementRecord> = new Map();
  private mappings: Map<string, PatternMapping> = new Map();
  private verifications: Map<string, VerificationRecord> = new Map();

  constructor(
    sources: SourceRecord[] = NHFG_SOURCES,
    principles: PrincipleRecord[] = NHFG_PRINCIPLES,
    requirements: RequirementRecord[] = NHFG_REQUIREMENTS,
    mappings: PatternMapping[] = NHFG_PATTERN_MAPPINGS,
    verifications: VerificationRecord[] = NHFG_VERIFICATIONS
  ) {
    sources.forEach(s => this.sources.set(s.id, s));
    principles.forEach(p => this.principles.set(p.id, p));
    requirements.forEach(r => this.requirements.set(r.id, r));
    mappings.forEach(m => this.mappings.set(m.id, m));
    verifications.forEach(v => this.verifications.set(v.id, v));
  }

  public getAllSources(): SourceRecord[] {
    return Array.from(this.sources.values());
  }

  public getSourceById(id: string): SourceRecord | undefined {
    return this.sources.get(id);
  }

  public getAllPrinciples(): PrincipleRecord[] {
    return Array.from(this.principles.values());
  }

  public getPrincipleById(id: string): PrincipleRecord | undefined {
    return this.principles.get(id);
  }

  public getPrinciplesBySource(sourceId: string): PrincipleRecord[] {
    return this.getAllPrinciples().filter(p => p.sourceId === sourceId);
  }

  public getAllRequirements(): RequirementRecord[] {
    return Array.from(this.requirements.values());
  }

  public getRequirementById(id: string): RequirementRecord | undefined {
    return this.requirements.get(id);
  }

  public getRequirementsByPrinciple(principleId: string): RequirementRecord[] {
    return this.getAllRequirements().filter(r => r.principleId === principleId);
  }

  public getAllMappings(): PatternMapping[] {
    return Array.from(this.mappings.values());
  }

  public getMappingById(id: string): PatternMapping | undefined {
    return this.mappings.get(id);
  }

  public getMappingsForPattern(patternId: string): PatternMapping[] {
    return this.getAllMappings().filter(m => m.patternId === patternId);
  }

  public getPatternsForPrinciple(principleId: string): { patternId: string; mapping: PatternMapping }[] {
    return this.getAllMappings()
      .filter(m => m.principleId === principleId)
      .map(m => ({ patternId: m.patternId, mapping: m }));
  }

  public getUnverifiedMappings(): PatternMapping[] {
    return this.getAllMappings().filter(
      m => m.status.scenarioVerificationStatus === 'NOT_ASSESSED' || m.epistemicCategory === 'UNVERIFIED_OR_UNKNOWN'
    );
  }

  public getHypothesisMappings(): PatternMapping[] {
    return this.getAllMappings().filter(m => m.epistemicCategory === 'DESIGN_HYPOTHESIS');
  }

  public getAllVerifications(): VerificationRecord[] {
    return Array.from(this.verifications.values());
  }

  public getVerificationById(id: string): VerificationRecord | undefined {
    return this.verifications.get(id);
  }

  public getVerificationsForRequirement(requirementId: string): VerificationRecord[] {
    return this.getAllVerifications().filter(v => v.requirementId === requirementId);
  }

  /**
   * Traces the complete normative chain from an Atlas pattern back to standard sources.
   * Pattern -> Mapping -> Requirement -> Principle -> Source
   */
  public traceChain(patternId: string): {
    source: SourceRecord;
    principle: PrincipleRecord;
    requirement?: RequirementRecord;
    mapping: PatternMapping;
    verification?: VerificationRecord;
  }[] {
    const patternMappings = this.getMappingsForPattern(patternId);
    const results = [];

    for (const mapping of patternMappings) {
      const principle = this.principles.get(mapping.principleId);
      if (!principle) continue;

      const source = this.sources.get(principle.sourceId);
      if (!source) continue;

      const requirement = mapping.requirementId ? this.requirements.get(mapping.requirementId) : undefined;
      const verification = mapping.verificationReference
        ? this.verifications.get(mapping.verificationReference)
        : requirement
        ? this.getVerificationsForRequirement(requirement.id)[0]
        : undefined;

      results.push({
        source,
        principle,
        requirement,
        mapping,
        verification
      });
    }

    return results;
  }

  /**
   * Validates dataset integrity:
   * 1. Unique IDs across all NHFG entities.
   * 2. Referential integrity (sources, principles, requirements exist).
   * 3. Target pattern exists in actual canonical pattern registry.
   * 4. Status combinations are legal.
   */
  public validateRegistry(canonicalPatterns: PatternEntity[]): NhfgRegistryValidationReport {
    const allIds = new Set<string>();
    const duplicateIds: string[] = [];

    const checkId = (id: string) => {
      if (allIds.has(id)) {
        duplicateIds.push(id);
      }
      allIds.add(id);
    };

    this.sources.forEach(s => checkId(s.id));
    this.principles.forEach(p => checkId(p.id));
    this.requirements.forEach(r => checkId(r.id));
    this.mappings.forEach(m => checkId(m.id));
    this.verifications.forEach(v => checkId(v.id));

    // Referential checks
    const unresolvedSourceRefs: string[] = [];
    this.principles.forEach(p => {
      if (!this.sources.has(p.sourceId)) {
        unresolvedSourceRefs.push(`${p.id} -> ${p.sourceId}`);
      }
    });

    const unresolvedPrincipleRefs: string[] = [];
    this.requirements.forEach(r => {
      if (!this.principles.has(r.principleId)) {
        unresolvedPrincipleRefs.push(`${r.id} -> ${r.principleId}`);
      }
    });
    this.mappings.forEach(m => {
      if (!this.principles.has(m.principleId)) {
        unresolvedPrincipleRefs.push(`${m.id} -> ${m.principleId}`);
      }
    });

    const unresolvedRequirementRefs: string[] = [];
    this.mappings.forEach(m => {
      if (m.requirementId && !this.requirements.has(m.requirementId)) {
        unresolvedRequirementRefs.push(`${m.id} -> ${m.requirementId}`);
      }
    });
    this.verifications.forEach(v => {
      if (!this.requirements.has(v.requirementId)) {
        unresolvedRequirementRefs.push(`${v.id} -> ${v.requirementId}`);
      }
    });

    // Check pattern reference against canonical patterns
    const canonicalPatternIdSet = new Set(canonicalPatterns.map(p => p.id));
    const unresolvedPatternRefs: string[] = [];
    this.mappings.forEach(m => {
      if (!canonicalPatternIdSet.has(m.patternId)) {
        unresolvedPatternRefs.push(`${m.id} -> ${m.patternId}`);
      }
    });

    // Check status legality
    const invalidStatusMappings: { mappingId: string; error: string }[] = [];
    this.mappings.forEach(m => {
      const statusRes = validateMappingStatus(m.status);
      if (!statusRes.valid) {
        invalidStatusMappings.push({ mappingId: m.id, error: statusRes.error ?? 'Invalid status combination' });
      }
    });

    const unverifiedMappingsCount = this.getUnverifiedMappings().length;

    const isValid =
      duplicateIds.length === 0 &&
      unresolvedSourceRefs.length === 0 &&
      unresolvedPrincipleRefs.length === 0 &&
      unresolvedRequirementRefs.length === 0 &&
      unresolvedPatternRefs.length === 0 &&
      invalidStatusMappings.length === 0;

    return {
      isValid,
      totalSources: this.sources.size,
      totalPrinciples: this.principles.size,
      totalRequirements: this.requirements.size,
      totalMappings: this.mappings.size,
      totalVerifications: this.verifications.size,
      duplicateIds,
      unresolvedSourceRefs,
      unresolvedPrincipleRefs,
      unresolvedRequirementRefs,
      unresolvedPatternRefs,
      invalidStatusMappings,
      unverifiedMappingsCount
    };
  }
}
