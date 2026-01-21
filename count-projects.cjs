const http = require('http');

http.get('http://localhost:3001/api/projects', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const projects = JSON.parse(body);
    console.log('Total projects:', projects.length);
    console.log('\nProject names:');
    projects.forEach(p => console.log(' -', p.name));
  });
});
