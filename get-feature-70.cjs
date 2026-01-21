// Use same database path as the MCP feature server
const path = require('path');
const dbPath = path.join(process.cwd(), 'features.db');
// better-sqlite3 is in the pnpm node_modules
const Database = require(path.join(process.cwd(), 'node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3'));
const db = new Database(dbPath);
const feature = db.prepare('SELECT * FROM features WHERE id = 70').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
