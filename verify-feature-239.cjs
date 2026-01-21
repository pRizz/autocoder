const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');

// Get feature #239 details
const feature239 = db.prepare('SELECT * FROM features WHERE id = 239').get();
console.log('Feature #239:');
console.log(JSON.stringify(feature239, null, 2));

// Check if feature #240 exists and depends on #239
const feature240 = db.prepare('SELECT * FROM features WHERE id = 240').get();
if (feature240) {
  console.log('\nFeature #240:');
  console.log(JSON.stringify(feature240, null, 2));

  // Check dependencies
  const deps = feature240.dependencies ? JSON.parse(feature240.dependencies) : [];
  console.log('\nFeature #240 depends on #239:', deps.includes(239));
} else {
  console.log('\nFeature #240 does not exist');
}

// Verify feature #239 properties
console.log('\n--- Verification Results ---');
console.log('Has ID 239:', feature239.id === 239);
console.log('Has correct name:', feature239.name === 'Test Feature X (dependency for Y) - verify fix');
console.log('Has correct category:', feature239.category === 'test-feature-103-verify');
console.log('Has steps:', feature239.steps && feature239.steps.length > 0);
console.log('Has description:', feature239.description && feature239.description.length > 0);

const allPassed = feature239.id === 239 &&
  feature239.name === 'Test Feature X (dependency for Y) - verify fix' &&
  feature239.category === 'test-feature-103-verify' &&
  feature239.steps && feature239.steps.length > 0 &&
  feature239.description && feature239.description.length > 0;

console.log('\nAll checks pass:', allPassed);

db.close();
