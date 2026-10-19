/**
 * Atlas Engineering Patterns — Pattern Ingestion & Maintenance Pipeline
 * Scope enforcement, duplicate detection, schema validation, relationship checks, and audit logging.
 */

import {
  ProposalInput,
  IngestionReviewResult,
  AtlasEntity
} from './types';
import { ALL_CANONICAL_ENTITIES } from './canonicalData';
import { RELATION_RULES } from './graphEngine';

export class IngestionEngine {
  private existingEntities: AtlasEntity[];

  constructor(existingEntities?: AtlasEntity[]) {
    this.existingEntities = existingEntities || ALL_CANONICAL_ENTITIES;
  }

  public reviewProposal(proposal: ProposalInput): IngestionReviewResult {
    // 1. Strict Scope Check
    const scopeCheck = this.validateScope(proposal);

    // 2. Duplicate & Synonym Detection
    const duplicateAnalysis = this.analyzeDuplicates(proposal);

    // 3. Stable Identifier Generation
    const generatedId = this.generateStableId(proposal);

    // 4. Schema Validation
    const schemaValidation = this.validateSchema(proposal);

    // 5. Relationship Validation
    const relationValidation = this.validateProposedRelations(proposal);

    // 6. Recommendation formulation
    let recommendation: IngestionReviewResult['recommendation'] = 'ACCEPT_CANDIDATE';

    if (scopeCheck.verdict === 'OUT_OF_SCOPE') {
      recommendation = 'REJECT_OUT_OF_SCOPE';
    } else if (duplicateAnalysis.isDuplicate) {
      recommendation = 'FLAG_DUPLICATE';
    } else if (!schemaValidation.valid || !relationValidation.valid) {
      recommendation = 'REQUEST_REVISIONS';
    }

    // 7. Structured Review Report
    const reviewReport = this.compileReport({
      proposal,
      generatedId,
      scopeCheck,
      duplicateAnalysis,
      schemaValidation,
      relationValidation,
      recommendation
    });

    return {
      scopeVerdict: scopeCheck.verdict,
      scopeReason: scopeCheck.reason,
      duplicateAnalysis,
      generatedId,
      schemaValid: schemaValidation.valid,
      schemaErrors: schemaValidation.errors,
      relationValidation,
      recommendation,
      reviewReport
    };
  }

  private validateScope(proposal: ProposalInput): { verdict: 'IN_SCOPE' | 'OUT_OF_SCOPE'; reason: string } {
    const text = `${proposal.title} ${proposal.problemStatement} ${proposal.solutionDescription}`.toLowerCase();

    // Out-of-scope prohibited indicators
    const outOfScopeKeywords = [
      'crypto wallet', 'blockchain', 'social network feed', 'e-commerce shopping cart',
      'dating app', 'general purpose ai chat agent', 'sql query optimizer', 'pcb schematic routing',
      'fpga vhdl synthesis', 'inventory billing accounting', 'crm sales pipeline'
    ];

    for (const kw of outOfScopeKeywords) {
      if (text.includes(kw)) {
        return {
          verdict: 'OUT_OF_SCOPE',
          reason: `Proposal explicitly contains '${kw}'. Scope is strictly limited to interface configuration of educational, research, and laboratory stands.`
        };
      }
    }

    // Must touch on stand interface configuration concepts
    const inScopeKeywords = [
      'stand', 'interface', 'telemetry', 'sensor', 'actuator', 'display', 'screen', 'gauge',
      'waveform', 'stepper', 'safety', 'interlock', 'student', 'experiment', 'bench', 'lab',
      'control', 'annunciator', 'protocol', 'measurement', 'operator', 'calibration'
    ];

    const hasInScopeKeyword = inScopeKeywords.some(kw => text.includes(kw));
    if (!hasInScopeKeyword) {
      return {
        verdict: 'OUT_OF_SCOPE',
        reason: 'Proposal does not demonstrate relevance to laboratory, research, or educational stand interfaces.'
      };
    }

    return {
      verdict: 'IN_SCOPE',
      reason: 'Proposal addresses interface layout, telemetry presentation, controls, or safety in stand environments.'
    };
  }

  private analyzeDuplicates(proposal: ProposalInput): {
    isDuplicate: boolean;
    highestSimilarityPercent: number;
    conflictingEntityId?: string;
    explanation: string;
  } {
    const propTitleTokens = this.tokenize(proposal.title);
    const propDescTokens = this.tokenize(proposal.problemStatement + ' ' + proposal.solutionDescription);

    let maxSimilarity = 0;
    let mostSimilarEntity: AtlasEntity | null = null;

    let maxTitleSim = 0;

    for (const entity of this.existingEntities) {
      if (entity.type !== proposal.targetType) continue;

      const entityTitleTokens = this.tokenize(entity.title);
      const entityDescTokens = this.tokenize(entity.shortDescription + ' ' + entity.fullDescription);

      const titleSim = this.jaccardSimilarity(propTitleTokens, entityTitleTokens);
      const descSim = this.jaccardSimilarity(propDescTokens, entityDescTokens);

      const compositeScore = Math.round((titleSim * 0.7 + descSim * 0.3) * 100);

      if (compositeScore > maxSimilarity) {
        maxSimilarity = compositeScore;
        mostSimilarEntity = entity;
        maxTitleSim = titleSim;
      }
    }

    const isDuplicate = Boolean(mostSimilarEntity && (maxSimilarity >= 45 || maxTitleSim >= 0.60));

    if (isDuplicate && mostSimilarEntity) {
      return {
        isDuplicate: true,
        highestSimilarityPercent: maxSimilarity,
        conflictingEntityId: mostSimilarEntity.id,
        explanation: `Substantially duplicates or overlaps with canonical entity '${mostSimilarEntity.title}' (${mostSimilarEntity.id}) with ${maxSimilarity}% semantic token overlap. Consider updating '${mostSimilarEntity.id}' rather than introducing a redundant entity.`
      };
    }

    return {
      isDuplicate: false,
      highestSimilarityPercent: maxSimilarity,
      conflictingEntityId: mostSimilarEntity ? mostSimilarEntity.id : undefined,
      explanation: mostSimilarEntity
        ? `Closest related entity is '${mostSimilarEntity.title}' with ${maxSimilarity}% overlap; distinct enough to qualify as a separate candidate.`
        : 'Unique conceptual footprint with zero overlap in canonical registry.'
    };
  }

  private generateStableId(proposal: ProposalInput): string {
    const prefixMap: Record<ProposalInput['targetType'], string> = {
      primitive: 'prim',
      pattern: 'pat',
      configuration: 'cfg',
      implementation: 'impl',
      evidence: 'evid'
    };

    const prefix = prefixMap[proposal.targetType] || 'ent';
    const slug = proposal.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32);

    let candidateId = `${prefix}-${slug}`;

    // Ensure uniqueness
    let counter = 1;
    while (this.existingEntities.some(e => e.id === candidateId)) {
      candidateId = `${prefix}-${slug}-v${counter++}`;
    }

    return candidateId;
  }

  private validateSchema(proposal: ProposalInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!proposal.title || proposal.title.trim().length < 4) {
      errors.push('Title must be at least 4 characters long.');
    }

    if (!proposal.problemStatement || proposal.problemStatement.trim().length < 15) {
      errors.push('Problem statement must be at least 15 characters long.');
    }

    if (!proposal.solutionDescription || proposal.solutionDescription.trim().length < 20) {
      errors.push('Solution description must be at least 20 characters long.');
    }

    if (!proposal.author || proposal.author.trim().length < 3) {
      errors.push('Author/Source attribution is mandatory.');
    }

    const validCategories = ['layout', 'telemetry', 'controls', 'safety', 'guidance', 'multi-screen'];
    if (!validCategories.includes(proposal.domainCategory)) {
      errors.push(`Invalid domainCategory '${proposal.domainCategory}'. Allowed: ${validCategories.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private validateProposedRelations(proposal: ProposalInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rel of proposal.proposedRelations) {
      const targetEntity = this.existingEntities.find(e => e.id === rel.targetId);

      if (!targetEntity) {
        errors.push(`Target entity '${rel.targetId}' does not exist in the canonical registry (dangling reference).`);
        continue;
      }

      const rule = RELATION_RULES[rel.relation];
      if (!rule) {
        errors.push(`Unknown relation type '${rel.relation}'.`);
        continue;
      }

      if (!rule.allowedSourceTypes.includes(proposal.targetType)) {
        errors.push(`Relation '${rel.relation}' cannot originate from '${proposal.targetType}'. Allowed: ${rule.allowedSourceTypes.join(', ')}`);
      }

      if (!rule.allowedTargetTypes.includes(targetEntity.type)) {
        errors.push(`Relation '${rel.relation}' cannot target '${targetEntity.type}'. Allowed: ${rule.allowedTargetTypes.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private tokenize(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
    );
  }

  private jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  private compileReport(context: {
    proposal: ProposalInput;
    generatedId: string;
    scopeCheck: { verdict: string; reason: string };
    duplicateAnalysis: { isDuplicate: boolean; highestSimilarityPercent: number; conflictingEntityId?: string; explanation: string };
    schemaValidation: { valid: boolean; errors: string[] };
    relationValidation: { valid: boolean; errors: string[] };
    recommendation: string;
  }): string {
    return `================================================================================
ATLAS INGESTION & MAINTENANCE AUDIT REPORT
Target ID: ${context.generatedId}
Title: ${context.proposal.title}
Entity Type: ${context.proposal.targetType.toUpperCase()}
Category: ${context.proposal.domainCategory}
Author: ${context.proposal.author}
--------------------------------------------------------------------------------
1. SCOPE BOUNDARY AUDIT: [${context.scopeCheck.verdict}]
   ${context.scopeCheck.reason}

2. DUPLICATE & SYNONYM ANALYSIS:
   Duplicate Flag: ${context.duplicateAnalysis.isDuplicate ? 'YES (FLAGGED)' : 'NO'}
   Highest Overlap: ${context.duplicateAnalysis.highestSimilarityPercent}%
   ${context.duplicateAnalysis.explanation}

3. SCHEMA INTEGRITY: [${context.schemaValidation.valid ? 'VALID' : 'INVALID'}]
   ${context.schemaValidation.errors.length === 0 ? 'All mandatory fields and types satisfied.' : context.schemaValidation.errors.join('; ')}

4. GRAPH RELATION INTEGRITY: [${context.relationValidation.valid ? 'VALID' : 'INVALID'}]
   ${context.relationValidation.errors.length === 0 ? 'All proposed edges connect to existing nodes with valid type semantics.' : context.relationValidation.errors.join('; ')}

FINAL PIPELINE RECOMMENDATION: [${context.recommendation}]
Lifecycle Assigned: PROPOSED (Requires review before canonical merge)
================================================================================`;
  }
}
