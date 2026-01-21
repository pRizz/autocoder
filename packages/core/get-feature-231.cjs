const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, '..', '..', 'features.db');
console.log('Database path:', dbPath);
const db = new Database(dbPath);

// Get total count
const total = db.prepare('SELECT COUNT(*) as count FROM features').get();
console.log('Total features:', total.count);

// Get max ID
const maxId = db.prepare('SELECT MAX(id) as max_id FROM features').get();
console.log('Max feature ID:', maxId.max_id);

// Check feature #231 and related features
const f231 = db.prepare('SELECT * FROM features WHERE id = 231').get();
console.log('\nFeature #231:', JSON.stringify(f231, null, 2));

db.close();
