const db = require('better-sqlite3')('/Users/peterryszkiewicz/Repos/auto-opencoder/features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 93').get();
console.log(JSON.stringify(feature, null, 2));
