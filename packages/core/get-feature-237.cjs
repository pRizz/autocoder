const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../features.db');
const db = new Database(dbPath);

// Get feature 237
const row237 = db.prepare('SELECT * FROM features WHERE id = 237').get();
console.log('Feature #237:');
console.log(JSON.stringify(row237, null, 2));

// Verify feature exists and has required attributes
console.log('\nVerification:');
const checks = {
  hasId: row237 && row237.id === 237,
  hasName: row237 && row237.name.includes('Test Feature A'),
  hasCategory: row237 && row237.category === 'test-feature-103',
  hasSteps: row237 && row237.steps && JSON.parse(row237.steps).length > 0,
  hasDescription: row237 && row237.description.length > 0
};
console.log('- Has ID 237:', checks.hasId);
console.log('- Has correct name:', checks.hasName);
console.log('- Has correct category:', checks.hasCategory);
console.log('- Has steps:', checks.hasSteps);
console.log('- Has description:', checks.hasDescription);
console.log('- All checks pass:', Object.values(checks).every(v => v));

db.close();
