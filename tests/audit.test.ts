/**
 * Atlas Engineering Patterns — Automated Repository & Audit Test Suite
 * Executable via `npm test` using tsx.
 */

import { ALL_CANONICAL_ENTITIES } from '../src/atlas/canonicalData';
import { KnowledgeGraph } from '../src/atlas/graphEngine';
import { RetrievalEngine } from '../src/atlas/retrievalEngine';
import { IngestionEngine } from '../src/atlas/ingestionEngine';
import { AuditEngine } from '../src/atlas/auditEngine';

function runTests() {
  console.log('================================================================');
  console.log('ATLAS ENGINEERING PATTERNS — TEST SUITE EXECUTION');
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

  // TEST SUITE 1: Canonical Dataset Integrity
  console.log('\n--- 1. Canonical Dataset Structure & Stability ---');
  assert(ALL_CANONICAL_ENTITIES.length >= 20, `Canonical entity count (${ALL_CANONICAL_ENTITIES.length}) meets baseline threshold`);

  const idSet = new Set<string>();
  let hasDuplicateIds = false;
  for (const ent of ALL_CANONICAL_ENTITIES) {
    if (idSet.has(ent.id)) {
      hasDuplicateIds = true;
      break;
    }
    idSet.add(ent.id);
  }
  assert(!hasDuplicateIds, 'All canonical entity IDs are strictly unique');

  const typesPresent = new Set(ALL_CANONICAL_ENTITIES.map(e => e.type));
  assert(
    typesPresent.has('primitive') &&
    typesPresent.has('pattern') &&
    typesPresent.has('configuration') &&
    typesPresent.has('implementation') &&
    typesPresent.has('evidence'),
    'All 5 canonical entity types are populated'
  );

  const draPattern = ALL_CANONICAL_ENTITIES.find(e => e.id === 'pat-deterministic-reasoning-anchor');
  assert(draPattern !== undefined && draPattern.type === 'pattern', 'Deterministic Reasoning Anchor pattern is present in canonical records');

  // TEST SUITE 2: Knowledge Graph Construction & Semantic Validation
  console.log('\n--- 2. Knowledge Graph & Relationship Rules ---');
  const graph = new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  const graphValidation = graph.validateGraph();
  assert(graphValidation.danglingEdges.length === 0, 'Zero dangling edges in knowledge graph');
  assert(graphValidation.invalidTypeEdges.length === 0, 'Zero type-constraint violations in graph edges');

  // Verify graph neighbor traversal
  const neighborsOfDial = graph.getNeighbors('prim-calibrated-gauge-dial');
  assert(neighborsOfDial.length > 0, 'Graph neighbor traversal returns connected nodes');

  // TEST SUITE 3: Deterministic Retrieval & Constraint Satisfaction
  console.log('\n--- 3. Retrieval & Composition Engine ---');
  const retrieval = new RetrievalEngine(graph);

  // Normal Case: Undergraduate Wind Tunnel
  const windTunnelRes = retrieval.composeSolution({
    standName: 'Test Wind Tunnel',
    purpose: 'STUDENT_LAB_EXPERIMENT',
    userLevel: 'UNDERGRADUATE',
    requiredCapabilities: ['guided workflow', 'telemetry', 'time-series'],
    screensCount: 1,
    peripherals: ['Pitot tube'],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });
  assert(windTunnelRes.matchedPatterns.some(p => p.pattern.id === 'pat-guided-student-experiment-stepper'), 'Normal case: guided stepper matched for undergraduate experiment');
  assert(windTunnelRes.matchedPrimitives.length > 0, 'Normal case: primitives populated in blueprint zones');

  // Boundary Case: Secondary School student must NOT receive certified operator high-hazard pattern
  const secondaryRes = retrieval.composeSolution({
    standName: 'School Demonstration',
    purpose: 'EDUCATIONAL_DEMO',
    userLevel: 'SECONDARY_SCHOOL',
    requiredCapabilities: ['telemetry', 'safety interlock'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });
  assert(
    !secondaryRes.matchedPatterns.some(p => p.pattern.id === 'pat-dual-operator-safety-interlock'),
    'Boundary constraint: Secondary school user level strictly excludes hazardous certified interlocks'
  );

  // Anti-Hallucination: Knowledge Gap Detection for Unrepresented Requirements
  const gapRes = retrieval.composeSolution({
    standName: 'Quantum Cryostat Stand',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['superconducting levitation 3d magnetic tomography'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });
  assert(
    gapRes.knowledgeGaps.length > 0 &&
    gapRes.knowledgeGaps.some(g => g.unmetRequirement.includes('superconducting levitation')),
    'Anti-hallucination check: missing capability correctly flagged as explicit Knowledge Gap'
  );

  // Conflict Suppression: Conflicting patterns must not be co-selected
  const conflictRes = retrieval.composeSolution({
    standName: 'Conflicting Request Bench',
    purpose: 'STUDENT_LAB_EXPERIMENT',
    userLevel: 'UNDERGRADUATE',
    requiredCapabilities: ['guided workflow', 'two-person interlock safety'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });
  const hasBothConflicting =
    conflictRes.matchedPatterns.some(p => p.pattern.id === 'pat-guided-student-experiment-stepper') &&
    conflictRes.matchedPatterns.some(p => p.pattern.id === 'pat-dual-operator-safety-interlock');
  assert(!hasBothConflicting, 'Conflict prevention: incompatible patterns suppressed from co-selection');

  // TEST SUITE 4: Ingestion Pipeline Gatekeeping
  console.log('\n--- 4. Ingestion Pipeline & Scope Gatekeeping ---');
  const ingestion = new IngestionEngine(ALL_CANONICAL_ENTITIES);

  // Out of scope test
  const outOfScopeResult = ingestion.reviewProposal({
    title: 'Blockchain NFT Staking Smart Contract Widget',
    targetType: 'primitive',
    domainCategory: 'controls',
    problemStatement: 'Students want to pay using crypto web3 tokens for laboratory stand usage.',
    solutionDescription: 'Embed a Web3 Ethereum connect button into the stand header navigation.',
    author: 'Crypto Tester',
    lifecycleStatus: 'PROPOSED',
    proposedRelations: []
  });
  assert(outOfScopeResult.recommendation === 'REJECT_OUT_OF_SCOPE', 'Ingestion gatekeeper: rejects out-of-scope non-stand proposal');

  // Duplicate test
  const duplicateResult = ingestion.reviewProposal({
    title: 'Scrolling Time-Series Strip Chart for Sensors',
    targetType: 'primitive',
    domainCategory: 'telemetry',
    problemStatement: 'Stand operators need to observe continuous sensor streams over time with auto-scaling axes.',
    solutionDescription: 'Continuous strip chart rendering analog and digital sensor streams with configurable temporal window.',
    author: 'Duplicate Tester',
    lifecycleStatus: 'PROPOSED',
    proposedRelations: []
  });
  assert(duplicateResult.recommendation === 'FLAG_DUPLICATE', 'Ingestion gatekeeper: flags duplicate/synonym proposal');

  // Valid proposal test
  const validProposalResult = ingestion.reviewProposal({
    title: 'Piezoelectric Vibration Spectrogram Canvas',
    targetType: 'primitive',
    domainCategory: 'telemetry',
    problemStatement: 'Bearing vibration sensors on rotating stands require time-frequency visualization.',
    solutionDescription: 'Canvas-based rolling spectrogram with Viridis colormap and FFT harmonic markers.',
    author: 'Acoustics Lab',
    lifecycleStatus: 'PROPOSED',
    proposedRelations: [
      { relation: 'COMPOSES_WITH', targetId: 'prim-time-series-strip' }
    ]
  });
  assert(validProposalResult.recommendation === 'ACCEPT_CANDIDATE', 'Ingestion gatekeeper: accepts valid in-scope candidate');

  // TEST SUITE 5: Acceptance Audit Engine
  console.log('\n--- 5. Acceptance Audit Engine Execution ---');
  const audit = new AuditEngine();
  const auditReport = audit.runFullAudit();
  assert(auditReport.overallVerdict === 'ACCEPTED', `Acceptance Audit formal verdict is ACCEPTED (${auditReport.passedCriteria}/${auditReport.totalCriteria} criteria passed)`);
  assert(auditReport.findings.every(f => f.severity !== 'CRITICAL'), 'Acceptance Audit reports zero critical findings');

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
