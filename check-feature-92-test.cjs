const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('features.db');
const features = db.prepare('SELECT id, name, passes, category FROM features WHERE category = ? OR name LIKE ?').all('stats-test-92', '%STATS_TEST_92%');
console.log('Features matching stats-test-92:');
console.log(JSON.stringify(features, null, 2));
const total = db.prepare('SELECT COUNT(*) as count, SUM(passes) as passing FROM features').get();
console.log('\nTotal stats:', total);
db.close();
