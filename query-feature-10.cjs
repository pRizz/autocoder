const Database = require('/Users/peterryszkiewicz/Repos/auto-opencoder/node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3');
const db = new Database('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 10').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
