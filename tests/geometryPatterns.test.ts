/**
 * Atlas Engineering Patterns — Geometry Pattern Integration & Contract Test Suite
 * Verifies pat-parametric-geometry-identification and pat-scale-invariant-geometric-analytics
 * across canonical registry, knowledge graph, retrieval, ingestion, epistemic boundaries,
 * invalid scale-basis blocking, and no-zero-coercion invariants.
 */

import { ALL_CANONICAL_ENTITIES, CANONICAL_PATTERNS, CANONICAL_PRIMITIVES } from '../src/atlas/canonicalData';
import { KnowledgeGraph } from '../src/atlas/graphEngine';
import { RetrievalEngine } from '../src/atlas/retrievalEngine';
import { IngestionEngine } from '../src/atlas/ingestionEngine';

type ScaleMode = 'Absolute' | 'Relative' | 'Normalized' | 'Scaled' | 'Comparative';

interface NormalizedSeriesResult {
  status: 'OK' | 'BLOCKED_INVALID_BASIS' | 'NO_DATA';
  mode: ScaleMode;
  rawValues: (number | null)[];
  physicalUnits: string;
  normalizationBasisL: number | null | undefined;
  displayRulerFactor: number;
  normalizedValues: (number | null)[] | null;
  scaledDisplayValues: (number | null)[] | null;
  aggregateMean: number | 'NO_DATA';
  errorCode?: string;
}

/**
 * Reference contract evaluator for pat-scale-invariant-geometric-analytics (F = R(B, p; S)):
 * - Separates rawValues, physicalUnits, normalizationBasisL, and displayRulerFactor S.
 * - Blocks Normalized/Relative modes if L <= 0 or non-finite or missing.
 * - Forbids coercing null samples to 0.0.
 */
function evaluateScaleSeparableSpectrum(params: {
  rawValues: (number | null)[];
  physicalUnits: string;
  normalizationBasisL: number | null | undefined;
  dimensionPower?: 1 | 2 | 3;
  mode: ScaleMode;
  displayRulerFactor?: number;
}): NormalizedSeriesResult {
  const {
    rawValues,
    physicalUnits,
    normalizationBasisL,
    dimensionPower = 1,
    mode,
    displayRulerFactor = 1
  } = params;

  const hasNullSamples = rawValues.some(v => v === null || (typeof v === 'number' && !Number.isFinite(v)));

  if (mode === 'Normalized' || mode === 'Relative') {
    if (
      normalizationBasisL === null ||
      normalizationBasisL === undefined ||
      typeof normalizationBasisL !== 'number' ||
      !Number.isFinite(normalizationBasisL) ||
      normalizationBasisL <= 0
    ) {
      return {
        status: 'BLOCKED_INVALID_BASIS',
        mode,
        rawValues: [...rawValues],
        physicalUnits,
        normalizationBasisL,
        displayRulerFactor,
        normalizedValues: null,
        scaledDisplayValues: null,
        aggregateMean: 'NO_DATA',
        errorCode: 'UNDEFINED_OR_INVALID_SCALE_BASIS'
      };
    }

    const divisor = Math.pow(normalizationBasisL, dimensionPower);
    const normalizedValues = rawValues.map(v => (v === null ? null : v / divisor));

    if (hasNullSamples) {
      return {
        status: 'NO_DATA',
        mode,
        rawValues: [...rawValues],
        physicalUnits: 'dimensionless',
        normalizationBasisL,
        displayRulerFactor,
        normalizedValues,
        scaledDisplayValues: normalizedValues,
        aggregateMean: 'NO_DATA',
        errorCode: 'MISSING_SAMPLE_NO_ZERO_COERCION'
      };
    }

    const validNums = normalizedValues as number[];
    const mean = validNums.reduce((acc, x) => acc + x, 0) / validNums.length;

    return {
      status: 'OK',
      mode,
      rawValues: [...rawValues],
      physicalUnits: 'dimensionless',
      normalizationBasisL,
      displayRulerFactor,
      normalizedValues,
      scaledDisplayValues: normalizedValues,
      aggregateMean: mean
    };
  }

  // Absolute / Scaled / Comparative modes preserve rawValues & physicalUnits
  if (hasNullSamples) {
    return {
      status: 'NO_DATA',
      mode,
      rawValues: [...rawValues],
      physicalUnits,
      normalizationBasisL,
      displayRulerFactor,
      normalizedValues: null,
      scaledDisplayValues: rawValues.map(v => (v === null ? null : v * displayRulerFactor)),
      aggregateMean: 'NO_DATA',
      errorCode: 'MISSING_SAMPLE_NO_ZERO_COERCION'
    };
  }

  const scaledDisplayValues = rawValues.map(v => (v === null ? null : v * displayRulerFactor));
  const validNums = rawValues as number[];
  const mean = validNums.reduce((acc, x) => acc + x, 0) / validNums.length;

  return {
    status: 'OK',
    mode,
    rawValues: [...rawValues],
    physicalUnits,
    normalizationBasisL,
    displayRulerFactor,
    normalizedValues: null,
    scaledDisplayValues,
    aggregateMean: mean
  };
}

function runGeometryPatternTests() {
  console.log('================================================================');
  console.log('ATLAS — GEOMETRY PATTERN INTEGRATION & CONTRACT AUDIT SUITE');
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

  // 1. Pattern Discovery & Epistemic Metadata
  console.log('\n--- 1. Canonical Discovery & Epistemic Lifecycle ---');
  const p1 = CANONICAL_PATTERNS.find(p => p.id === 'pat-parametric-geometry-identification');
  const p2 = CANONICAL_PATTERNS.find(p => p.id === 'pat-scale-invariant-geometric-analytics');

  assert(p1 !== undefined, 'Found pat-parametric-geometry-identification in CANONICAL_PATTERNS');
  assert(p2 !== undefined, 'Found pat-scale-invariant-geometric-analytics in CANONICAL_PATTERNS');
  assert(
    p1?.lifecycleStatus === 'SPECIFIED' && p1.evidenceIds.length === 0,
    'PATTERN-01 has SPECIFIED status and empty evidenceIds (no fabricated evidence)'
  );
  assert(
    p2?.lifecycleStatus === 'PROPOSED' && p2.evidenceIds.length === 0,
    'PATTERN-02 has PROPOSED status and empty evidenceIds (no fabricated evidence)'
  );
  assert(
    Boolean(p1?.applicability.hardConstraints?.some(c => c.toLowerCase().includes('dimensional reference'))),
    'PATTERN-01 explicitly states impossibility of absolute scale recovery without dimensional reference'
  );
  assert(
    Boolean(p1?.applicability.hardConstraints?.some(c => c.toLowerCase().includes('out-of-family') || c.toLowerCase().includes('family'))),
    'PATTERN-01 explicitly bounds identification to declared parametric model family M(p)'
  );
  assert(
    Boolean(p2?.title.includes('Scale-Separable Analytical Representation')),
    'PATTERN-02 reflects Scale-Separable Analytical Representation semantics while preserving canonical ID'
  );

  // 2. Knowledge Graph Links & Unresolved Reference Checks
  console.log('\n--- 2. Knowledge Graph Integrity & Reference Resolution ---');
  const graph = new KnowledgeGraph(ALL_CANONICAL_ENTITIES);
  const validation = graph.validateGraph();
  assert(validation.isValid && validation.danglingEdges.length === 0, 'Zero dangling edges in KnowledgeGraph');
  assert(validation.invalidTypeEdges.length === 0, 'Zero invalid type edges in KnowledgeGraph');

  const primIdsSet = new Set(CANONICAL_PRIMITIVES.map(pr => pr.id));
  const p1PrimsValid = Boolean(p1?.primitiveIds.every(id => primIdsSet.has(id)));
  const p2PrimsValid = Boolean(p2?.primitiveIds.every(id => primIdsSet.has(id)));
  assert(p1PrimsValid && p2PrimsValid, 'All primitiveIds referenced by both geometry patterns exist in CANONICAL_PRIMITIVES');

  const p1Neighbors = graph.getNeighbors('pat-parametric-geometry-identification');
  const p2Neighbors = graph.getNeighbors('pat-scale-invariant-geometric-analytics');
  const reciprocalComposed =
    p1Neighbors.some(n => n.node.id === 'pat-scale-invariant-geometric-analytics' && n.edge.relation === 'COMPOSES_WITH' && n.direction === 'outgoing') &&
    p2Neighbors.some(n => n.node.id === 'pat-parametric-geometry-identification' && n.edge.relation === 'COMPOSES_WITH' && n.direction === 'outgoing');
  assert(reciprocalComposed, 'Reciprocal COMPOSES_WITH relationship verified between PATTERN-01 and PATTERN-02');
  assert(
    graph.detectConflicts(['pat-parametric-geometry-identification', 'pat-scale-invariant-geometric-analytics']).length === 0,
    'Zero ontology conflicts between PATTERN-01 and PATTERN-02'
  );

  // 3. RetrievalEngine & IngestionEngine Compatibility + Backward Compatibility
  console.log('\n--- 3. Retrieval, Ingestion & Backward Compatibility ---');
  assert(ALL_CANONICAL_ENTITIES.length === 56, `Backward compatibility: 53 baseline + 2 geometry patterns + 1 VADP pattern = 56 entities (found ${ALL_CANONICAL_ENTITIES.length})`);

  const retrieval = new RetrievalEngine(graph);
  const geoSolution = retrieval.composeSolution({
    standName: '2D/3D Geometric & Spectral Inspection Bench',
    purpose: 'RESEARCH_BENCH',
    userLevel: 'RESEARCHER',
    requiredCapabilities: ['parametric', 'scale-separable'],
    screensCount: 1,
    peripherals: ['Mouse'],
    hardConstraints: [],
    accessibilityNeeds: [],
    optionalPreferences: []
  });

  const matchedP1 = geoSolution.matchedPatterns.some(m => m.pattern.id === 'pat-parametric-geometry-identification');
  const matchedP2 = geoSolution.matchedPatterns.some(m => m.pattern.id === 'pat-scale-invariant-geometric-analytics');
  assert(matchedP1 && matchedP2, 'RetrievalEngine discovers both geometry patterns for geometric stand query');
  assert(
    geoSolution.validationStatus === 'UNVERIFIED' &&
    Boolean(geoSolution.lossLog?.some(l => l.type === 'HEURISTIC_MATCH_ONLY')),
    'Epistemic guardrail: unverified geometry patterns yield UNVERIFIED status and HEURISTIC_MATCH_ONLY in lossLog'
  );

  const ingestion = new IngestionEngine(ALL_CANONICAL_ENTITIES);
  const dupCheck = ingestion.reviewProposal({
    title: 'Parametric Geometry Identification (Inverse Model Alignment)',
    targetType: 'pattern',
    domainCategory: 'telemetry',
    problemStatement: 'Direct pixel measurement on unknown 2D/3D stand drawings fails without physical scale.',
    solutionDescription: 'Overlay parametric model on crosshair canvas and minimize discrepancy error.',
    lifecycleStatus: 'PROPOSED',
    proposedRelations: [],
    author: 'Audit Tester'
  });
  assert(dupCheck.recommendation === 'FLAG_DUPLICATE', 'IngestionEngine detects duplicate proposal overlapping PATTERN-01');

  // 4. Contract Invariants: Invalid Reference Scale Blocking & No Null-to-Zero Coercion
  console.log('\n--- 4. Scale Basis Blocking & Missing-Data Non-Coercion Checks ---');
  for (const badBasis of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, null, undefined]) {
    const blockedRes = evaluateScaleSeparableSpectrum({
      rawValues: [10, 20, 30],
      physicalUnits: 'mm',
      normalizationBasisL: badBasis,
      mode: 'Normalized'
    });
    assert(
      blockedRes.status === 'BLOCKED_INVALID_BASIS' &&
      blockedRes.normalizedValues === null &&
      blockedRes.errorCode === 'UNDEFINED_OR_INVALID_SCALE_BASIS',
      `Invalid reference basis L=${String(badBasis)} strictly blocks Normalized mode`
    );
  }

  // Missing data sample (null) must NOT be coerced to 0.0
  const missingSampleRes = evaluateScaleSeparableSpectrum({
    rawValues: [10.0, null, 30.0],
    physicalUnits: 'mm',
    normalizationBasisL: 10.0,
    mode: 'Normalized'
  });
  assert(
    missingSampleRes.status === 'NO_DATA' &&
    missingSampleRes.normalizedValues?.[1] === null &&
    missingSampleRes.aggregateMean === 'NO_DATA',
    'Missing measurement sample (null) returns NO_DATA and is never coerced to 0.0'
  );

  // Separation of display ruler scaling S from raw data & normalization
  const scaleARes = evaluateScaleSeparableSpectrum({
    rawValues: [10.0, 20.0],
    physicalUnits: 'mm',
    normalizationBasisL: 10.0,
    mode: 'Scaled',
    displayRulerFactor: 0.5 // 1/2 ruler
  });
  const scaleBRes = evaluateScaleSeparableSpectrum({
    rawValues: [10.0, 20.0],
    physicalUnits: 'mm',
    normalizationBasisL: 10.0,
    mode: 'Scaled',
    displayRulerFactor: 0.625 // 5/8 ruler
  });
  assert(
    scaleARes.rawValues[0] === 10.0 &&
    scaleBRes.rawValues[0] === 10.0 &&
    scaleARes.physicalUnits === 'mm' &&
    scaleBRes.physicalUnits === 'mm' &&
    scaleARes.scaledDisplayValues?.[1] !== scaleBRes.scaledDisplayValues?.[1],
    'Changing display ruler scale S (1/2 vs 5/8) preserves rawValues and physicalUnits unchanged'
  );

  console.log('================================================================');
  console.log(`TOTAL GEOMETRY PATTERN TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runGeometryPatternTests();
