const Database = require('./packages/core/node_modules/better-sqlite3');
const db = new Database('./features.db');

// Check features 233 and 234 status
const f233 = db.prepare('SELECT id, name, passes, in_progress, dependencies FROM features WHERE id = 233').get();
const f234 = db.prepare('SELECT id, name, passes, in_progress, dependencies FROM features WHERE id = 234').get();

console.log("Feature A (233):", JSON.stringify(f233, null, 2));
console.log("Feature B (234):", JSON.stringify(f234, null, 2));

// Check if B would be considered ready (passes=0, in_progress=0, all deps passing)
if (f233.passes === 1) {
  console.log("\n✓ Feature A (233) is passing");
} else {
  console.log("\n✗ Feature A (233) is NOT passing");
}

if (f234.passes === 0 && f234.in_progress === 0) {
  // Parse dependencies
  const deps = f234.dependencies ? JSON.parse(f234.dependencies) : [];
  console.log("Feature B dependencies:", deps);

  // Check if all deps are passing
  let allDepsPassing = true;
  for (const depId of deps) {
    const dep = db.prepare('SELECT passes FROM features WHERE id = ?').get(depId);
    if (!dep || dep.passes !== 1) {
      allDepsPassing = false;
      console.log(`Dependency ${depId} is NOT passing`);
    } else {
      console.log(`Dependency ${depId} is passing`);
    }
  }

  if (allDepsPassing) {
    console.log("\n✓ Feature B (234) is READY (all deps satisfied, not in progress, not passing)");
  } else {
    console.log("\n✗ Feature B (234) is BLOCKED");
  }
} else if (f234.passes === 1) {
  console.log("\n✓ Feature B (234) is already PASSING");
} else {
  console.log("\n✗ Feature B (234) is in progress");
}

db.close();
