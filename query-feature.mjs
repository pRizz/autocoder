import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('./packages/core/node_modules/better-sqlite3');

const db = new Database('./features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(148);
console.log(JSON.stringify(feature, null, 2));
db.close();
