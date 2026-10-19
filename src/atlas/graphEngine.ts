/**
 * Atlas Engineering Patterns — Knowledge Graph Construction & Traversal Engine
 * Generated directly from canonical records.
 */

import { AtlasEntity, EntityType, RelationType, GraphRelation, CompatibilityResult } from './types';

export interface GraphNode {
  id: string;
  entity: AtlasEntity;
  type: EntityType;
  title: string;
  category: string;
  status: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: RelationType;
  rationale?: string;
}

export interface RelationRule {
  relation: RelationType;
  meaning: string;
  allowedSourceTypes: EntityType[];
  allowedTargetTypes: EntityType[];
  isSymmetric: boolean;
}

export const RELATION_RULES: Record<RelationType, RelationRule> = {
  USES: {
    relation: 'USES',
    meaning: 'Source incorporates or consumes the target as an architectural building block.',
    allowedSourceTypes: ['pattern', 'configuration'],
    allowedTargetTypes: ['primitive', 'pattern'],
    isSymmetric: false
  },
  COMPOSES_WITH: {
    relation: 'COMPOSES_WITH',
    meaning: 'Source coordinates harmoniously in adjacent spatial or logical zones with target.',
    allowedSourceTypes: ['primitive', 'pattern'],
    allowedTargetTypes: ['primitive', 'pattern'],
    isSymmetric: true
  },
  REQUIRES: {
    relation: 'REQUIRES',
    meaning: 'Source strictly requires presence of target capability or structural component to function.',
    allowedSourceTypes: ['pattern', 'configuration'],
    allowedTargetTypes: ['primitive', 'pattern'],
    isSymmetric: false
  },
  ALTERNATIVE_TO: {
    relation: 'ALTERNATIVE_TO',
    meaning: 'Source provides an alternative solution with differing ergonomic or computational trade-offs.',
    allowedSourceTypes: ['primitive', 'pattern'],
    allowedTargetTypes: ['primitive', 'pattern'],
    isSymmetric: true
  },
  SPECIALIZES: {
    relation: 'SPECIALIZES',
    meaning: 'Source is a constrained, specialized, or domain-adapted variant of target.',
    allowedSourceTypes: ['pattern'],
    allowedTargetTypes: ['pattern'],
    isSymmetric: false
  },
  CONFLICTS_WITH: {
    relation: 'CONFLICTS_WITH',
    meaning: 'Source and target cannot safely or ergonomically coexist in the same interface configuration.',
    allowedSourceTypes: ['primitive', 'pattern', 'configuration'],
    allowedTargetTypes: ['primitive', 'pattern', 'configuration'],
    isSymmetric: true
  },
  IMPLEMENTED_IN: {
    relation: 'IMPLEMENTED_IN',
    meaning: 'Source concept is instantiated and tested in concrete software/hardware implementation.',
    allowedSourceTypes: ['pattern', 'configuration'],
    allowedTargetTypes: ['implementation'],
    isSymmetric: false
  },
  VERIFIED_BY: {
    relation: 'VERIFIED_BY',
    meaning: 'Source design choice is backed by formal empirical trials, audits, or standards.',
    allowedSourceTypes: ['primitive', 'pattern', 'configuration', 'implementation'],
    allowedTargetTypes: ['evidence'],
    isSymmetric: false
  }
};

export interface GraphValidationReport {
  isValid: boolean;
  totalNodes: number;
  totalEdges: number;
  danglingEdges: GraphEdge[];
  invalidTypeEdges: { edge: GraphEdge; error: string }[];
  asymmetryWarnings: string[];
}

export class KnowledgeGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];
  private outgoing: Map<string, GraphEdge[]> = new Map();
  private incoming: Map<string, GraphEdge[]> = new Map();

  constructor(entities: AtlasEntity[]) {
    this.buildFromEntities(entities);
  }

  private buildFromEntities(entities: AtlasEntity[]): void {
    // 1. Populate nodes
    for (const entity of entities) {
      this.nodes.set(entity.id, {
        id: entity.id,
        entity,
        type: entity.type,
        title: entity.title,
        category: entity.domainCategory,
        status: entity.lifecycleStatus
      });
      this.outgoing.set(entity.id, []);
      this.incoming.set(entity.id, []);
    }

    // 2. Extract edges from entity declared relations and canonical linkages
    const edgeKeySet = new Set<string>();

    for (const entity of entities) {
      // Collect explicit relations
      const declaredRelations: GraphRelation[] = [...(entity.relations || [])];

      // Also ensure evidenceIds are linked via VERIFIED_BY if not already declared
      if (entity.evidenceIds) {
        for (const evId of entity.evidenceIds) {
          if (!declaredRelations.some(r => r.relation === 'VERIFIED_BY' && r.targetId === evId)) {
            declaredRelations.push({
              sourceId: entity.id,
              relation: 'VERIFIED_BY',
              targetId: evId
            });
          }
        }
      }

      // If pattern has primitives, ensure USES relation exists
      if (entity.type === 'pattern' && 'primitiveIds' in entity) {
        for (const primId of entity.primitiveIds) {
          if (!declaredRelations.some(r => r.relation === 'USES' && r.targetId === primId)) {
            declaredRelations.push({
              sourceId: entity.id,
              relation: 'USES',
              targetId: primId
            });
          }
        }
      }

      // If configuration has selectedPatterns/Primitives
      if (entity.type === 'configuration' && 'selectedPatterns' in entity) {
        for (const patId of entity.selectedPatterns) {
          if (!declaredRelations.some(r => r.relation === 'USES' && r.targetId === patId)) {
            declaredRelations.push({
              sourceId: entity.id,
              relation: 'USES',
              targetId: patId
            });
          }
        }
      }

      for (const rel of declaredRelations) {
        const edgeId = `${rel.sourceId}->${rel.relation}->${rel.targetId}`;
        if (!edgeKeySet.has(edgeId)) {
          edgeKeySet.add(edgeId);
          const edge: GraphEdge = {
            id: edgeId,
            source: rel.sourceId,
            target: rel.targetId,
            relation: rel.relation,
            rationale: rel.rationale
          };
          this.edges.push(edge);

          if (!this.outgoing.has(rel.sourceId)) this.outgoing.set(rel.sourceId, []);
          this.outgoing.get(rel.sourceId)!.push(edge);

          if (!this.incoming.has(rel.targetId)) this.incoming.set(rel.targetId, []);
          this.incoming.get(rel.targetId)!.push(edge);
        }
      }
    }
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): GraphEdge[] {
    return this.edges;
  }

  public getOutgoingEdges(nodeId: string): GraphEdge[] {
    return this.outgoing.get(nodeId) || [];
  }

  public getIncomingEdges(nodeId: string): GraphEdge[] {
    return this.incoming.get(nodeId) || [];
  }

  public getNeighbors(nodeId: string): { node: GraphNode; edge: GraphEdge; direction: 'outgoing' | 'incoming' }[] {
    const results: { node: GraphNode; edge: GraphEdge; direction: 'outgoing' | 'incoming' }[] = [];

    for (const edge of this.getOutgoingEdges(nodeId)) {
      const targetNode = this.getNode(edge.target);
      if (targetNode) {
        results.push({ node: targetNode, edge, direction: 'outgoing' });
      }
    }

    for (const edge of this.getIncomingEdges(nodeId)) {
      const sourceNode = this.getNode(edge.source);
      if (sourceNode) {
        results.push({ node: sourceNode, edge, direction: 'incoming' });
      }
    }

    return results;
  }

  public validateGraph(): GraphValidationReport {
    const danglingEdges: GraphEdge[] = [];
    const invalidTypeEdges: { edge: GraphEdge; error: string }[] = [];
    const asymmetryWarnings: string[] = [];

    for (const edge of this.edges) {
      const sourceNode = this.nodes.get(edge.source);
      const targetNode = this.nodes.get(edge.target);

      // 1. Check for dangling references
      if (!sourceNode || !targetNode) {
        danglingEdges.push(edge);
        continue;
      }

      // 2. Validate semantics and allowed types
      const rule = RELATION_RULES[edge.relation];
      if (!rule) {
        invalidTypeEdges.push({ edge, error: `Unknown relation type '${edge.relation}'` });
        continue;
      }

      if (!rule.allowedSourceTypes.includes(sourceNode.type)) {
        invalidTypeEdges.push({
          edge,
          error: `Relation ${edge.relation} does not allow source type '${sourceNode.type}'. Allowed: ${rule.allowedSourceTypes.join(', ')}`
        });
      }

      if (!rule.allowedTargetTypes.includes(targetNode.type)) {
        invalidTypeEdges.push({
          edge,
          error: `Relation ${edge.relation} does not allow target type '${targetNode.type}'. Allowed: ${rule.allowedTargetTypes.join(', ')}`
        });
      }

      // 3. Symmetric checks
      if (rule.isSymmetric) {
        const reverseEdge = this.edges.find(
          e => e.source === edge.target && e.target === edge.source && e.relation === edge.relation
        );
        if (!reverseEdge) {
          asymmetryWarnings.push(`Symmetric relation ${edge.relation} between ${edge.source} and ${edge.target} lacks reciprocal link.`);
        }
      }
    }

    const isValid = danglingEdges.length === 0 && invalidTypeEdges.length === 0;

    return {
      isValid,
      totalNodes: this.nodes.size,
      totalEdges: this.edges.length,
      danglingEdges,
      invalidTypeEdges,
      asymmetryWarnings
    };
  }

  public detectConflicts(candidateIds: string[]): { entityA: string; entityB: string; reason: string }[] {
    const conflicts: { entityA: string; entityB: string; reason: string }[] = [];
    const candidateSet = new Set(candidateIds);

    for (const id of candidateIds) {
      const outgoing = this.getOutgoingEdges(id);
      for (const edge of outgoing) {
        if (edge.relation === 'CONFLICTS_WITH' && candidateSet.has(edge.target)) {
          conflicts.push({
            entityA: id,
            entityB: edge.target,
            reason: edge.rationale || 'Explicit CONFLICTS_WITH relation in ontology.'
          });
        }
      }
    }

    return conflicts;
  }

  public checkCompatibility(source: AtlasEntity, target: AtlasEntity): CompatibilityResult {
    if (!source.contract || !target.contract) {
      return 'UNKNOWN';
    }

    const { outputPorts } = source.contract;
    const { inputPorts } = target.contract;

    // Minimal compatibility rule: at least one matching output port for every required input port
    for (const input of inputPorts) {
      if (input.required) {
        const hasMatchingOutput = outputPorts.some(
          output => output.type === input.type
        );
        if (!hasMatchingOutput) {
          return 'INCOMPATIBLE';
        }
      }
    }

    return 'COMPATIBLE';
  }
}
