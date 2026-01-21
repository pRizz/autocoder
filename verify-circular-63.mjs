// Use the core package to query the database
import { getDatabase, initializeTables } from './packages/core/dist/db/connection.js';
import { features } from './packages/core/dist/db/schema.js';
import { eq, inArray } from 'drizzle-orm';

const db = getDatabase('./features.db');
initializeTables(db);

const result = db.select({
  id: features.id,
  name: features.name,
  dependencies: features.dependencies
}).from(features).where(inArray(features.id, [241, 242])).all();

console.log('Feature A (241) and Feature B (242) after circular dependency rejection:');
console.log(JSON.stringify(result, null, 2));

// Verify Feature A (241) has NO dependencies (circular was rejected)
const featureA = result.find(f => f.id === 241);
const featureB = result.find(f => f.id === 242);

console.log('\n=== Verification Results ===');
console.log('Feature A (241) dependencies:', featureA?.dependencies || 'null (no dependencies)');
console.log('Feature B (242) dependencies:', featureB?.dependencies || 'null (no dependencies)');

// Check if Feature A incorrectly has 242 as dependency
const featureADeps = featureA?.dependencies ? JSON.parse(featureA.dependencies) : [];
if (featureADeps.includes(242)) {
  console.log('\n❌ REGRESSION: Feature A has dependency on 242 - partial update occurred!');
  process.exit(1);
} else {
  console.log('\n✓ PASSED: Feature A does NOT have dependency on 242 - no partial update');
}

// Verify Feature B still has 241 as dependency
const featureBDeps = featureB?.dependencies ? JSON.parse(featureB.dependencies) : [];
if (featureBDeps.includes(241)) {
  console.log('✓ PASSED: Feature B still has dependency on 241');
} else {
  console.log('❌ REGRESSION: Feature B lost its dependency on 241!');
  process.exit(1);
}

console.log('\n=== All checks passed - Feature #63 regression test PASSED ===');
