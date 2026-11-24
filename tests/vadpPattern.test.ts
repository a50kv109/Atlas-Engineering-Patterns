/**
 * Atlas Engineering Patterns — VADP Integration & Epistemic Contract Test Suite
 * Verifies pat-visual-analytical-discovery across canonical registry, schema,
 * knowledge graph, retrieval engine, epistemic maturity, and non-regression.
 */

import { ALL_CANONICAL_ENTITIES, CANONICAL_PATTERNS, CANONICAL_PRIMITIVES } from '../src/atlas/canonicalData';
import { KnowledgeGraph } from '../src/atlas/graphEngine';
import { RetrievalEngine } from '../src/atlas/retrievalEngine';
import { IngestionEngine } from '../src/atlas/ingestionEngine';

function runVadpPatternTests() {
  console.log('================================================================');
  console.log('ATLAS — VADP PATTERN INTEGRATION & CONTRACT TEST SUITE');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `— ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Canonical Discovery, Uniqueness & Epistemic Lifecycle
  console.log('\n--- 1. Canonical Discovery, Schema & Epistemic Lifecycle ---');
  const vadp = CANONICAL_PATTERNS.find(p => p.id === 'pat-visual-analytical-discovery');
  assert(vadp !== undefined, 'Found pat-visual-analytical-discovery in CANONICAL_PATTERNS');

  const ids = ALL_CANONICAL_ENTITIES.map(e => e.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === ALL_CANONICAL_ENTITIES.length, 'All canonical entity IDs remain strictly unique');
  assert(
    ALL_CANONICAL_ENTITIES.length === 56,
    `Backward compatibility: 53 baseline + 2 geometry patterns + 1 VADP = 56 entities (found ${ALL_CANONICAL_ENTITIES.length})`
  );
  assert(
    vadp?.lifecycleStatus === 'PROPOSED' && vadp.evidenceIds.length === 0,
    'VADP has PROPOSED lifecycleStatus and empty evidenceIds (no fabricated empirical validation)'
  );
  assert(
    Boolean(
      vadp?.problemStatement &&
      vadp.solutionSummary &&
      vadp.tradeOffs.advantages.length > 0 &&
      vadp.tradeOffs.disadvantages.length > 0 &&
      vadp.contract &&
      vadp.contract.inputPorts.length >= 2 &&
      vadp.contract.outputPorts.length >= 2
    ),
    'VADP satisfies full PatternEntity and typed Contract schema'
  );
  assert(
    Boolean(vadp?.applicability.hardConstraints?.some(c => c.includes('ANALYTICALLY_VERIFIED'))),
    'VADP explicitly forbids auto-promoting visual features to ANALYTICALLY_VERIFIED'
  );

  // 2. Knowledge Graph Integrity & Relationship Semantics
  console.log('\n--- 2. Knowledge Graph Integrity & Relationship Semantics ---');
  const graph = new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  const validation = graph.validateGraph();
  assert(validation.isValid && validation.danglingEdges.length === 0, 'Zero dangling edges in KnowledgeGraph');
  assert(validation.invalidTypeEdges.length === 0, 'Zero invalid type edges in KnowledgeGraph');

  const primSet = new Set(CANONICAL_PRIMITIVES.map(pr => pr.id));
  assert(
    Boolean(vadp?.primitiveIds.length && vadp.primitiveIds.every(id => primSet.has(id))),
    'All primitiveIds referenced by VADP exist in CANONICAL_PRIMITIVES'
  );

  const vadpOutgoing = graph.getOutgoingEdges('pat-visual-analytical-discovery');
  const usesWaterfall = vadpOutgoing.some(e => e.target === 'prim-multichannel-waterfall' && e.relation === 'USES');
  const composesWaterfall = vadpOutgoing.some(e => e.target === 'prim-multichannel-waterfall' && e.relation === 'COMPOSES_WITH');
  assert(
    !usesWaterfall && composesWaterfall,
    'prim-multichannel-waterfall is optional COMPOSES_WITH rather than mandatory USES dependency'
  );

  const composesGeometry =
    vadpOutgoing.some(e => e.target === 'pat-parametric-geometry-identification' && e.relation === 'COMPOSES_WITH') &&
    vadpOutgoing.some(e => e.target === 'pat-scale-invariant-geometric-analytics' && e.relation === 'COMPOSES_WITH');
  assert(composesGeometry, 'VADP declares justified COMPOSES_WITH edges to both geometry patterns');

  const composesEpistemic =
    vadpOutgoing.some(e => e.target === 'pat-epistemic-status-labeling' && e.relation === 'COMPOSES_WITH') &&
    vadpOutgoing.some(e => e.target === 'pat-deterministic-reasoning-anchor' && e.relation === 'COMPOSES_WITH');
  assert(composesEpistemic, 'VADP declares justified COMPOSES_WITH edges to epistemic labeling and DRA');

  assert(
    graph.detectConflicts([
      'pat-visual-analytical-discovery',
      'pat-parametric-geometry-identification',
      'pat-scale-invariant-geometric-analytics',
      'pat-high-rate-signal-inspection',
      'pat-epistemic-status-labeling',
      'pat-deterministic-reasoning-anchor'
    ]).length === 0,
    'Zero ontology conflicts across VADP and related analytical/epistemic patterns'
  );

  // 3. Retrieval Engine Relevance & Existing Geometry Patterns Preservation
  console.log('\n--- 3. Retrieval Relevance & Non-Regression ---');
  const retrieval = new RetrievalEngine(graph);
  const vadpSolution = retrieval.composeSolution({
    standName: 'Parametric Visual Analytical Discovery Bench',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['visual-analytics', 'hypothesis', 'parametric'],
    screensCount: 1,
    peripherals: ['Mouse'],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });

  assert(
    vadpSolution.matchedPatterns.some(m => m.pattern.id === 'pat-visual-analytical-discovery'),
    'RetrievalEngine selects pat-visual-analytical-discovery for visual analytical research scenario'
  );
  assert(
    vadpSolution.validationStatus === 'UNVERIFIED' &&
    Boolean(vadpSolution.lossLog?.some(l => l.type === 'HEURISTIC_MATCH_ONLY')),
    'Epistemic guardrail: unverified VADP yields UNVERIFIED validationStatus and HEURISTIC_MATCH_ONLY'
  );

  // Ensure IngestionEngine detects duplicate of VADP rather than silently duplicating
  const ingestion = new IngestionEngine(ALL_CANONICAL_ENTITIES);
  const dupReview = ingestion.reviewProposal({
    title: 'Visual Analytical Discovery Pattern (VADP) Interface',
    targetType: 'pattern',
    domainCategory: 'telemetry',
    problemStatement: 'Researchers and AI agents miss structural symmetry and invariance in parameterized systems without visual discovery.',
    solutionDescription: 'Provide an interactive parametric visualization and 7-stage hypothesis verification workflow with synchronized curves.',
    lifecycleStatus: 'PROPOSED',
    proposedRelations: [],
    author: 'VADP Audit'
  });
  assert(dupReview.recommendation === 'FLAG_DUPLICATE', `IngestionEngine detects duplicate proposal overlapping VADP (got ${dupReview.recommendation}, overlap ${dupReview.duplicateAnalysis.highestSimilarityPercent}%)`);

  // Preserve existing geometry patterns unmodified
  const geo1 = CANONICAL_PATTERNS.find(p => p.id === 'pat-parametric-geometry-identification');
  const geo2 = CANONICAL_PATTERNS.find(p => p.id === 'pat-scale-invariant-geometric-analytics');
  assert(
    geo1?.lifecycleStatus === 'SPECIFIED' &&
    geo1.evidenceIds.length === 0 &&
    geo2?.lifecycleStatus === 'PROPOSED' &&
    geo2.evidenceIds.length === 0,
    'Existing geometry patterns remain untouched (SPECIFIED / PROPOSED with empty evidenceIds)'
  );

  console.log('================================================================');
  console.log(`TOTAL VADP TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVadpPatternTests();
