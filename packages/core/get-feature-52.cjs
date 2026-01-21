const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, '..', '..', 'features.db');
console.log('Database path:', dbPath);
const db = new Database(dbPath, { readonly: true });
const feature = db.prepare('SELECT * FROM features WHERE id = 52').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
