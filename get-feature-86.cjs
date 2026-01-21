const Database = require('better-sqlite3');
const db = new Database('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(86);
console.log(JSON.stringify(feature, null, 2));
db.close();
