const WebSocket = require('/Users/peterryszkiewicz/Repos/auto-opencoder/node_modules/.pnpm/ws@8.19.0/node_modules/ws');

const ws = new WebSocket('ws://localhost:3001/ws');

ws.on('open', function open() {
  console.log('Connected!');
});

ws.on('message', function message(data) {
  console.log('Received:', data.toString());
  ws.close();
});

ws.on('error', function error(err) {
  console.error('Error:', err.message);
});

ws.on('close', function close() {
  console.log('Connection closed');
  process.exit(0);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.log('Timeout - no connection');
  process.exit(1);
}, 5000);
