const http = require('http');

http.get('http://localhost:3001/api/projects/open-autocoder/features', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    console.log('Response type:', typeof response, Array.isArray(response));
    console.log('Keys:', Object.keys(response));

    // Try to find feature 53
    const features = response.features || response;
    if (Array.isArray(features)) {
      const feature = features.find(f => f.id === 53);
      console.log('\nFeature #53:');
      console.log(JSON.stringify(feature, null, 2));
    } else {
      console.log('First 500 chars:', JSON.stringify(response).slice(0, 500));
    }
  });
}).on('error', err => console.error(err));
