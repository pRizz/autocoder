const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('features.db');
const row = db.prepare('SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = 60').get();
console.log(JSON.stringify(row, null, 2));
db.close();
