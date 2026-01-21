const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 49').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
