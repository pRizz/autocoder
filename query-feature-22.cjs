const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('./features.db');
const feature16 = db.prepare('SELECT id, name, passes FROM features WHERE id = 16').get();
console.log('Feature 16 (dependency):', JSON.stringify(feature16, null, 2));
db.close();
