/**
 * Atlas Engineering Patterns — Epistemic Transparency and Loss Accounting Tests (Phase 1.3)
 */

import { RetrievalEngine } from '../src/atlas/retrievalEngine';
import { KnowledgeGraph } from '../src/atlas/graphEngine';
import { ALL_CANONICAL_ENTITIES } from '../src/atlas/canonicalData';
import { StandRequirementQuery } from '../src/atlas/types';

function runEpistemicTests() {
  console.log('================================================================');
  console.log('ATLAS × SOL-2 — EPISTEMIC REFINEMENT & LOSS LOG TESTS (PHASE 1.3)');
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

  const retrieval = new RetrievalEngine();

  const baseQuery: StandRequirementQuery = {
    standName: 'Test Stand',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['telemetry'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  };

  // Test 1: Priority of confirmed incompatibility & validation status
  const sol1 = retrieval.composeSolution(baseQuery);
  assert(sol1.validationStatus === 'COMPATIBLE' || sol1.validationStatus === 'UNVERIFIED', 'Test 1: Validation status correctly computed');

  // Test 2: Epistemic provenance is attached
  assert(sol1.epistemicProvenance !== undefined, 'Test 2: Epistemic provenance is attached to solution');

  // Test 3: Absence of false COMPATIBLE when coverage is incomplete (knowledge gaps present)
  const queryWithGap = {
    ...baseQuery,
    requiredCapabilities: ['non-existent-quantum-teleportation-capability']
  };
  const solGap = retrieval.composeSolution(queryWithGap);
  assert(solGap.validationStatus === 'UNVERIFIED', 'Test 3: Knowledge gaps force UNVERIFIED validation status instead of false COMPATIBLE');

  // Test 4: Preservation of CONFLICT separately from technical status
  assert(solGap.activeConflicts !== undefined, 'Test 4: Active conflicts tracked separately from technical incompatibility');

  // Test 5: Loss log registers unmet requirements properly
  assert(solGap.lossLog !== undefined && solGap.lossLog.some(l => l.type === 'UNMET_REQUIREMENT'), 'Test 5: Loss log registers unmet requirements');

  // Test 6: Correct registration of excluded candidates in lossLog
  assert(solGap.lossLog?.some(l => l.type === 'EXCLUDED_CANDIDATE') ?? false, 'Test 6: Excluded candidates correctly logged in lossLog');

  // Test 7: Separation of heuristic matches from verified capabilities (HEURISTIC_MATCH_ONLY)
  // If a requirement matches an entity that is PROPOSED/SPECIFIED without verified evidence,
  // it must register HEURISTIC_MATCH_ONLY in lossLog and force UNVERIFIED validation status.
  const graph = new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  const retrievalWithGraph = new RetrievalEngine(graph);
  const solHeuristic = retrievalWithGraph.composeSolution({
    ...baseQuery,
    requiredCapabilities: ['anatomy'] // matches pat-consistent-editor-anatomy which is PROPOSED
  });
  const hasHeuristicMatchOnly = solHeuristic.lossLog?.some(l => l.type === 'HEURISTIC_MATCH_ONLY') ?? false;
  assert(hasHeuristicMatchOnly && solHeuristic.validationStatus === 'UNVERIFIED', 'Test 7: Heuristic-only match registers HEURISTIC_MATCH_ONLY and forces UNVERIFIED status');

  // Test 8: Backward compatibility of existing retrieval and audit fields
  assert(Array.isArray(sol1.matchedPatterns) && Array.isArray(sol1.matchedPrimitives), 'Test 8: Backward compatibility preserved for matchedPatterns and matchedPrimitives');

  console.log('================================================================');
  console.log(`RESULTS: Passed: ${passed}, Failed: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runEpistemicTests();
