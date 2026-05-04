const http = require('http');

const data = JSON.stringify({
  name: 'BotTest',
  message: 'Hello from Bot'
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log('Response body:', body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
