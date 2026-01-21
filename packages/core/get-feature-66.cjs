const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// Registry database location
const registryPath = path.join(os.homedir(), '.open-autocoder', 'registry.db');
console.log('Registry path:', registryPath);

const registryDb = new Database(registryPath);

// Get project path for open-autocoder
const project = registryDb.prepare("SELECT * FROM projects WHERE name = 'open-autocoder'").get();
console.log('Project:', project);

if (project) {
  const featuresDb = new Database(path.join(project.path, 'features.db'));
  const feature = featuresDb.prepare('SELECT * FROM features WHERE id = 66').get();
  console.log('\nFeature #66:');
  console.log(JSON.stringify(feature, null, 2));
  featuresDb.close();
}

registryDb.close();
