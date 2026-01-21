import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
const db = new Database(process.env.PROJECT_DIR ? `${process.env.PROJECT_DIR}/features.db` : 'features.db');
const feature = db.prepare('SELECT * FROM features WHERE id = 206').get();
console.log(JSON.stringify(feature, null, 2));
db.close();
