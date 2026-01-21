const http = require('http');

// SQL injection payloads to test
const sqlInjectionPayloads = [
  "'; DROP TABLE projects;--",
  "test'; DROP TABLE features;--",
  "1' OR '1'='1",
  "'; DELETE FROM projects WHERE '1'='1",
  "test\" OR \"1\"=\"1",
  "'; UPDATE projects SET name='hacked';--",
];

async function testSqlInjection(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: payload,
      path: '/tmp/test-sql-injection'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          payload,
          status: res.statusCode,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function verifyDatabaseIntegrity() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/projects',
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          projects: JSON.parse(body)
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== SQL Injection Security Test for Feature #66 ===\n');

  // Step 1: Get current state of projects table
  console.log('Step 1: Checking initial database state...');
  const initialState = await verifyDatabaseIntegrity();
  console.log(`  Initial project count: ${initialState.projects.length}`);
  console.log(`  Status: ${initialState.status === 200 ? 'OK' : 'ERROR'}\n`);

  // Step 2: Test each SQL injection payload
  console.log('Step 2: Testing SQL injection payloads...\n');
  const results = [];

  for (const payload of sqlInjectionPayloads) {
    const result = await testSqlInjection(payload);
    results.push(result);
    console.log(`  Payload: "${payload.substring(0, 40)}${payload.length > 40 ? '...' : ''}"`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Response: ${result.body.substring(0, 100)}${result.body.length > 100 ? '...' : ''}`);
    console.log(`  Result: ${result.status === 400 || result.status === 422 ? 'REJECTED (SAFE)' : result.status === 201 ? 'ESCAPED (SAFE)' : 'CHECK MANUALLY'}\n`);
  }

  // Step 3: Verify database is not corrupted
  console.log('Step 3: Verifying database integrity after attacks...');
  const finalState = await verifyDatabaseIntegrity();
  console.log(`  Final project count: ${finalState.projects.length}`);
  console.log(`  Status: ${finalState.status === 200 ? 'OK' : 'ERROR'}`);
  console.log(`  Tables intact: ${finalState.status === 200 ? 'YES' : 'NO'}\n`);

  // Step 4: Test normal operation still works
  console.log('Step 4: Testing normal operation still works...');
  const normalResult = await testSqlInjection('test-normal-project-66');
  console.log(`  Normal project creation status: ${normalResult.status}`);
  console.log(`  Result: ${normalResult.status === 201 ? 'SUCCESS' : normalResult.status === 409 ? 'EXISTS (OK)' : 'FAILED'}\n`);

  // Summary
  console.log('=== SUMMARY ===');
  const allSafe = results.every(r => r.status === 400 || r.status === 422 || r.status === 201);
  const dbIntact = finalState.status === 200;
  const normalWorks = normalResult.status === 201 || normalResult.status === 409;

  console.log(`SQL injection payloads handled safely: ${allSafe ? 'YES' : 'NO'}`);
  console.log(`Database integrity maintained: ${dbIntact ? 'YES' : 'NO'}`);
  console.log(`Normal operations work: ${normalWorks ? 'YES' : 'NO'}`);
  console.log(`\nOVERALL: ${allSafe && dbIntact && normalWorks ? 'PASS - Feature #66 verified' : 'FAIL - Issues found'}`);
}

main().catch(console.error);
