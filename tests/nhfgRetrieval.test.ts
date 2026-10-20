/**
 * Atlas Engineering Patterns — NHFG × RetrievalEngine Integration Test Suite
 * Stage D: End-to-End Verification of Normative Guidance Attachment
 */

import { RetrievalEngine } from '../src/atlas/retrievalEngine';
import { KnowledgeGraph } from '../src/atlas/graphEngine';
import { ALL_CANONICAL_ENTITIES } from '../src/atlas/canonicalData';
import { StandRequirementQuery } from '../src/atlas/types';

function runRetrievalIntegrationTests() {
  console.log('================================================================');
  console.log('ATLAS NHFG × RETRIEVAL ENGINE INTEGRATION TEST SUITE (STAGE D)');
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

  const graph = new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  const retrieval = new RetrievalEngine(graph);

  // SCENARIO 1: Stand where missing measurement must not be interpreted as zero
  console.log('\n--- Scenario 1: Missing Measurement & Epistemic Labeling ---');
  const brakeStandQuery: StandRequirementQuery = {
    standName: 'Brake Dynamometer Research Stand',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['epistemic labeling', 'telemetry', 'calibration'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  };

  const brakeSolution = retrieval.composeSolution(brakeStandQuery);
  const epistemicPatternMatch = brakeSolution.matchedPatterns.find(
    p => p.pattern.id === 'pat-epistemic-status-labeling'
  );

  assert(epistemicPatternMatch !== undefined, 'Retrieval matches pat-epistemic-status-labeling for epistemic labeling query');
  assert(
    epistemicPatternMatch?.nhfgGuidance !== undefined && epistemicPatternMatch.nhfgGuidance.length > 0,
    'NHFG guidance is successfully attached to pat-epistemic-status-labeling'
  );

  if (epistemicPatternMatch?.nhfgGuidance) {
    const guidance = epistemicPatternMatch.nhfgGuidance[0];
    assert(guidance.source.id === 'src-iso9241-110-2020', 'Guidance correctly links to ISO 9241-110:2020');
    assert(guidance.principle.id === 'prin-iso9241-110-self-descriptiveness', 'Guidance links to Self-Descriptiveness principle');
    assert(guidance.requirement?.id === 'req-iso9241-110-no-data-distinct', 'Guidance links to requirement req-iso9241-110-no-data-distinct');
    assert(guidance.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED', 'Scenario status is SCENARIO_VERIFIED');
    assert(
      guidance.status.conformanceStatus === 'CONFORMANCE_NOT_ESTABLISHED',
      'Anti-conflation: Conformance status remains CONFORMANCE_NOT_ESTABLISHED (no false standard compliance claimed)'
    );
    assert(guidance.missingEvidence.length > 0, 'Guidance honestly notes missing operator trial and formal certification evidence');
  }

  assert(
    brakeSolution.nhfgSummary !== undefined && brakeSolution.nhfgSummary.totalNormativeMappings > 0,
    'Solution includes high-level nhfgSummary aggregating normative guidance'
  );
  assert(
    brakeSolution.nhfgSummary?.conformanceClaimedCount === 0,
    'Solution confirms zero unverified conformance claims'
  );

  // SCENARIO 2: Query without NHFG Guidance operates cleanly
  console.log('\n--- Scenario 2: Normal Search Without Relevant NHFG Mappings ---');
  const windTunnelQuery: StandRequirementQuery = {
    standName: 'Educational Wind Tunnel',
    purpose: 'STUDENT_LAB_EXPERIMENT',
    userLevel: 'UNDERGRADUATE',
    requiredCapabilities: ['guided workflow', 'time-series'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  };

  const windTunnelSolution = retrieval.composeSolution(windTunnelQuery);
  assert(windTunnelSolution.matchedPatterns.length > 0, 'Retrieval works normally for standard experiment without errors');
  assert(
    windTunnelSolution.validationStatus === 'COMPATIBLE' || windTunnelSolution.validationStatus === 'UNVERIFIED',
    'Standard validation status remains deterministic'
  );

  // SCENARIO 3: Pattern with DESIGN_HYPOTHESIS is explicitly disclosed
  console.log('\n--- Scenario 3: DESIGN_HYPOTHESIS Explicit Epistemic Handling ---');
  const splitWorkspaceQuery: StandRequirementQuery = {
    standName: 'CAD & Telemetry Console',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['workspace splitter', 'layout'],
    screensCount: 1,
    peripherals: ['Mouse or Touchpad'],
    hardConstraints: ['Viewport width >= 1024px'],
    accessibilityNeeds: [],
    optionalPreferences: []
  };

  const splitSolution = retrieval.composeSolution(splitWorkspaceQuery);
  const splitPatternMatch = splitSolution.matchedPatterns.find(
    p => p.pattern.id === 'pat-adjustable-split-workspace'
  );

  assert(splitPatternMatch !== undefined, 'Matches pat-adjustable-split-workspace');
  if (splitPatternMatch?.nhfgGuidance) {
    const splitGuidance = splitPatternMatch.nhfgGuidance[0];
    assert(
      splitGuidance.epistemicCategory === 'DESIGN_HYPOTHESIS',
      'pat-adjustable-split-workspace guidance is explicitly tagged as DESIGN_HYPOTHESIS'
    );
    assert(
      splitGuidance.status.scenarioVerificationStatus === 'NOT_ASSESSED',
      'Scenario verification is honestly marked NOT_ASSESSED'
    );
  }

  // Check epistemic provenance contains explicit hypothesis statement
  const hasHypothesisProvenance = splitSolution.epistemicProvenance?.some(
    ep => ep.status === 'UNKNOWN' && ep.statement.includes('DESIGN_HYPOTHESIS')
  );
  assert(
    hasHypothesisProvenance === true,
    'Epistemic provenance registers DESIGN_HYPOTHESIS with UNKNOWN status'
  );

  // SCENARIO 4: Anti-bias check (NHFG does not bypass hard constraints or conflicts)
  console.log('\n--- Scenario 4: Constraint Integrity & Anti-Bias ---');
  const secondarySchoolHazardQuery: StandRequirementQuery = {
    standName: 'Secondary School Physics Bench',
    purpose: 'EDUCATIONAL_DEMO',
    userLevel: 'SECONDARY_SCHOOL',
    requiredCapabilities: ['safety interlock', 'telemetry'],
    screensCount: 1,
    peripherals: [],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  };

  const hazardSolution = retrieval.composeSolution(secondarySchoolHazardQuery);
  assert(
    !hazardSolution.matchedPatterns.some(p => p.pattern.id === 'pat-dual-operator-safety-interlock'),
    'Hard constraint strictly excludes high-hazard interlock for secondary school learner (NHFG does not bypass safety constraints)'
  );

  console.log('================================================================');
  console.log(`TOTAL RETRIEVAL INTEGRATION TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runRetrievalIntegrationTests();
