import { AtlasEntity, PrimitiveEntity, Contract, CompatibilityResult } from '../src/atlas/types';
import { KnowledgeGraph } from '../src/atlas/graphEngine';

const testEngine = new KnowledgeGraph([]);

function createEntity(id: string, contract?: Contract): PrimitiveEntity {
  return {
    id,
    type: 'primitive',
    title: id,
    shortDescription: 'desc',
    fullDescription: 'desc',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: [],
    relations: [],
    evidenceIds: [],
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    authorOrSource: 'Test',
    contract,
    uiSlot: 'viewport',
    minFootprintPixels: { width: 100, height: 100 },
    supportsTouch: true,
    supportsKeyboard: true
  };
}

// 1. Both entities have valid contracts and the required source output exists.
const c1: Contract = {
  inputPorts: [],
  outputPorts: [{ id: 'o1', type: 'number', description: 'test' }],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
const c2: Contract = {
  inputPorts: [{ id: 'i1', type: 'number', description: 'test', required: true }],
  outputPorts: [],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
console.log('Test 1 (Valid match):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c2)));

// 2. Output matches input type
console.log('Test 2 (Type match):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c2)));

// 3. Source output type conflicts with target input type
const c3: Contract = {
  inputPorts: [{ id: 'i1', type: 'string', description: 'test', required: true }],
  outputPorts: [],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
console.log('Test 3 (Type conflict):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c3)));

// 4. Either contract is missing
console.log('Test 4a (Missing source contract):', testEngine.checkCompatibility(createEntity('a'), createEntity('b', c2)));
console.log('Test 4b (Missing target contract):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b')));

// 5. Contract exists but no relevant ports
const c4: Contract = { inputPorts: [], outputPorts: [], guarantees: [], constraints: [], version: '1.0' };
console.log('Test 5 (No ports):', testEngine.checkCompatibility(createEntity('a', c4), createEntity('b', c4)));

// 6. Target has multiple required inputs
const c5: Contract = {
  inputPorts: [
    { id: 'i1', type: 'number', description: 'test', required: true },
    { id: 'i2', type: 'string', description: 'test', required: true }
  ],
  outputPorts: [{ id: 'o1', type: 'number', description: 'test' }],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
console.log('Test 6 (Multiple required inputs - partial match):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c5)));

// 7. Some required inputs match, others don't
console.log('Test 7 (Partial match - fail):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c5)));

// 8. Port names match but types differ (already covered by Test 3/7)
// 9. Types match but port names/semantic IDs differ
const c6: Contract = {
  inputPorts: [{ id: 'i9', type: 'number', description: 'test', required: true }],
  outputPorts: [{ id: 'o9', type: 'number', description: 'test' }],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
console.log('Test 9 (Types match, IDs differ):', testEngine.checkCompatibility(createEntity('a', c6), createEntity('b', c6)));

// 10. Optional inputs (not required)
const c7: Contract = {
  inputPorts: [{ id: 'i1', type: 'string', description: 'test', required: false }],
  outputPorts: [],
  guarantees: [],
  constraints: [],
  version: '1.0'
};
console.log('Test 10 (Optional input - ignore missing output):', testEngine.checkCompatibility(createEntity('a', c1), createEntity('b', c7)));

// 11. Malformed - implicit in TS but empty array is valid
const c8: Contract = { inputPorts: [], outputPorts: [], guarantees: [], constraints: [], version: '1.0' };
console.log('Test 11 (Empty ports):', testEngine.checkCompatibility(createEntity('a', c8), createEntity('b', c8)));
