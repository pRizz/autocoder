// Check feature 93 in the root features.db (Python/MCP database)
const Database = require('better-sqlite3');
const path = require('path');

// The MCP server uses the root features.db
const db = new Database(path.join(__dirname, 'features.db'));
const feature = db.prepare('SELECT * FROM features WHERE id = 93').get();
console.log('Feature #93 from MCP database:');
console.log(JSON.stringify(feature, null, 2));
db.close();
