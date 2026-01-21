const Database = require('better-sqlite3');
const db = new Database('features.db');
const features = db.prepare('SELECT id, name, dependencies FROM features WHERE id IN (241, 242)').all();
console.log(JSON.stringify(features, null, 2));
db.close();
