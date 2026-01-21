const db = require('./packages/core/node_modules/better-sqlite3')('features.db');
const f = db.prepare('SELECT * FROM features WHERE id = 59').get();
console.log(JSON.stringify(f, null, 2));
db.close();
