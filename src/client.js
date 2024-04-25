const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('Connected to server');
});

ws.on('message', function incoming(data) {
  console.log(data.toString());
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  ws.send(input);
});

ws.on('close', () => {
  console.log('Server has closed');
  process.exit();
});
