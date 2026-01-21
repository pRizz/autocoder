const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('features.db');
const row = db.prepare('SELECT * FROM features WHERE id = 68').get();
console.log(JSON.stringify(row, null, 2));
db.close();
