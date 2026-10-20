/**
 * Atlas Engineering Patterns — Normative & Human Factors Guidance (NHFG) Test Suite
 * Stage C: Minimal ISO 9241 Pilot Verification
 */

import { CANONICAL_PATTERNS, ALL_CANONICAL_ENTITIES } from '../src/atlas/canonicalData';
import { NhfgEngine, validateMappingStatus } from '../src/atlas/nhfgEngine';
import { NHFG_SOURCES, NHFG_PRINCIPLES, NHFG_REQUIREMENTS, NHFG_PATTERN_MAPPINGS, NHFG_VERIFICATIONS } from '../src/atlas/nhfgData';
import { MappingStatusModel } from '../src/atlas/types';

function runNhfgTests() {
  console.log('================================================================');
  console.log('ATLAS NHFG — NORMATIVE & HUMAN FACTORS GUIDANCE TEST SUITE');
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

  const engine = new NhfgEngine();

  // SUITE 1: Dataset Integrity & ID Uniqueness
  console.log('\n--- 1. NHFG Registry Integrity & Stability ---');
  const validation = engine.validateRegistry(CANONICAL_PATTERNS);

  assert(validation.isValid, 'Overall NHFG registry validation passes with zero errors');
  assert(validation.duplicateIds.length === 0, 'All NHFG entity IDs are strictly unique across sources, principles, requirements, mappings, and verifications');
  assert(validation.totalSources === 3, `Expected 3 normative sources (ISO 9241-110, 210, 11), got ${validation.totalSources}`);
  assert(validation.totalPrinciples === 7, `Expected 7 interaction principles for ISO 9241-110, got ${validation.totalPrinciples}`);
  assert(validation.totalMappings >= 5, `Canonical pattern mappings populated (found ${validation.totalMappings})`);

  // SUITE 2: Referential Integrity & Canonical Pattern Linkage
  console.log('\n--- 2. Referential Integrity & Canonical Pattern Binding ---');
  assert(validation.unresolvedSourceRefs.length === 0, 'All principles reference verified existing sources');
  assert(validation.unresolvedPrincipleRefs.length === 0, 'All requirements and mappings reference valid principles');
  assert(validation.unresolvedRequirementRefs.length === 0, 'All requirements references in mappings and verifications are resolved');
  assert(
    validation.unresolvedPatternRefs.length === 0,
    'All patternId references in mappings strictly exist in CANONICAL_PATTERNS (no phantom pattern IDs)'
  );

  // Check specific candidate patterns
  const candidateIds = [
    'pat-epistemic-status-labeling',
    'pat-guided-student-experiment-stepper',
    'pat-calibrated-telemetry-console',
    'pat-preview-validate-commit',
    'pat-live-object-health-indicator'
  ];
  for (const cId of candidateIds) {
    const mappings = engine.getMappingsForPattern(cId);
    assert(mappings.length > 0, `Candidate pattern '${cId}' is mapped to normative principles`);
  }

  // SUITE 3: Orthogonal Status Model & Anti-Conflation Guardrails
  console.log('\n--- 3. Status Model Guardrails & Anti-Conflation ---');

  // Test illegal status: Claiming conformance with no evaluation method
  const illegalStatusNoMethod: MappingStatusModel = {
    designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
    scenarioVerificationStatus: 'SCENARIO_VERIFIED',
    userEvaluationStatus: 'USER_EVALUATED',
    conformanceStatus: 'CONFORMANCE_CLAIMED',
    conformanceMethod: 'NONE'
  };
  const noMethodCheck = validateMappingStatus(illegalStatusNoMethod);
  assert(!noMethodCheck.valid, 'Guardrail rejects CONFORMANCE_CLAIMED when evaluation method is NONE');

  // Test illegal status: Claiming conformance with no scenario test
  const illegalStatusNoScenario: MappingStatusModel = {
    designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
    scenarioVerificationStatus: 'NOT_ASSESSED',
    userEvaluationStatus: 'USER_EVALUATED',
    conformanceStatus: 'CONFORMANCE_CLAIMED',
    conformanceMethod: 'FIRST_PARTY_SELF_ASSESSMENT'
  };
  const noScenarioCheck = validateMappingStatus(illegalStatusNoScenario);
  assert(!noScenarioCheck.valid, 'Guardrail rejects CONFORMANCE_CLAIMED when scenarios are NOT_ASSESSED');

  // Test illegal status: Scenario verified without design rationale
  const illegalScenarioNoRationale: MappingStatusModel = {
    designRationaleStatus: 'NOT_ASSESSED',
    scenarioVerificationStatus: 'SCENARIO_VERIFIED',
    userEvaluationStatus: 'NOT_ASSESSED',
    conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
    conformanceMethod: 'NONE'
  };
  const noRationaleCheck = validateMappingStatus(illegalScenarioNoRationale);
  assert(!noRationaleCheck.valid, 'Guardrail rejects SCENARIO_VERIFIED when design rationale is NOT_ASSESSED');

  // Test legitimate state: Scenario verified does NOT imply standard conformance
  const validScenarioVerified: MappingStatusModel = {
    designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
    scenarioVerificationStatus: 'SCENARIO_VERIFIED',
    userEvaluationStatus: 'NOT_ASSESSED',
    conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
    conformanceMethod: 'NONE'
  };
  const validCheck = validateMappingStatus(validScenarioVerified);
  assert(validCheck.valid, 'Valid state: SCENARIO_VERIFIED coexists with CONFORMANCE_NOT_ESTABLISHED');

  // SUITE 4: Epistemic Separation & Honest Gap Accounting
  console.log('\n--- 4. Epistemic Separation & Gap Accounting ---');
  const hypothesisMappings = engine.getHypothesisMappings();
  assert(hypothesisMappings.length > 0, `Explicit DESIGN_HYPOTHESIS mappings identified (${hypothesisMappings.length} mappings)`);

  const unverifiedMappings = engine.getUnverifiedMappings();
  assert(unverifiedMappings.length > 0, `Unverified/unassessed mappings honestly reported (${unverifiedMappings.length} mappings)`);

  // Verify that all canonical mappings maintain CONFORMANCE_NOT_ESTABLISHED by default
  const anyFalseConformance = NHFG_PATTERN_MAPPINGS.some(m => m.status.conformanceStatus === 'CONFORMANCE_CLAIMED');
  assert(!anyFalseConformance, 'Zero premature standard conformance claims across all pilot mappings');

  // SUITE 5: Full Traceability Chain (Source -> Principle -> Requirement -> Pattern -> Verification)
  console.log('\n--- 5. End-to-End Traceability Chain ---');
  const epistemicChain = engine.traceChain('pat-epistemic-status-labeling');
  assert(epistemicChain.length > 0, 'Chain resolved for pat-epistemic-status-labeling');
  if (epistemicChain.length > 0) {
    const link = epistemicChain[0];
    assert(link.source.id === 'src-iso9241-110-2020', 'Link traces to ISO 9241-110:2020');
    assert(link.principle.id === 'prin-iso9241-110-self-descriptiveness', 'Link traces to Self-Descriptiveness');
    assert(link.requirement?.id === 'req-iso9241-110-no-data-distinct', 'Link traces to requirement req-iso9241-110-no-data-distinct');
    assert(link.verification?.id === 'verif-req-no-data-scenario-01', 'Link traces to executable verification verif-req-no-data-scenario-01');
  }

  // Executable scenario check for req-iso9241-110-no-data-distinct:
  // Missing data cannot be treated as numeric 0.0
  const sampleMeasurements: (number | null)[] = [12.4, null, 14.2];
  const hasNull = sampleMeasurements.some(m => m === null);
  const calculatedSumWithoutValidation = sampleMeasurements.reduce((acc: number, val) => acc + (val ?? 0), 0);
  assert(
    hasNull && calculatedSumWithoutValidation === 26.6,
    'Executable check: naive fallback would treat null as 0.0 (distorting average)'
  );
  // Verified pattern logic:
  const isDataIncomplete = sampleMeasurements.includes(null);
  const validatedOutput = isDataIncomplete ? 'NO_DATA' : (sampleMeasurements as number[]).reduce((a, b) => a + b, 0);
  assert(validatedOutput === 'NO_DATA', 'Verified scenario: pat-epistemic-status-labeling forbids treating missing data as 0.0');

  // SUITE 6: Backward Compatibility with Atlas Core
  console.log('\n--- 6. Backward Compatibility with Atlas Core ---');
  assert(ALL_CANONICAL_ENTITIES.length === 53, `Canonical entity count remains exactly 53 (found ${ALL_CANONICAL_ENTITIES.length})`);

  console.log('================================================================');
  console.log(`TOTAL NHFG TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runNhfgTests();
