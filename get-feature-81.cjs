const Database = require('/Users/peterryszkiewicz/Repos/auto-opencoder/packages/core/node_modules/better-sqlite3');
const db = new Database('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');
const row = db.prepare('SELECT * FROM features WHERE id = 81').get();
console.log(JSON.stringify(row, null, 2));
db.close();
