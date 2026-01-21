const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('features.db');
// Get features with IDs 158-162
const features = db.prepare('SELECT id, name, passes, category FROM features WHERE id IN (158, 159, 160, 161, 162)').all();
console.log('Features with IDs 158-162:');
console.log(JSON.stringify(features, null, 2));
// Get the most recent features
const recent = db.prepare('SELECT id, name, passes, category FROM features ORDER BY id DESC LIMIT 10').all();
console.log('\nMost recent features:');
console.log(JSON.stringify(recent, null, 2));
db.close();
