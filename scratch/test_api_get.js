const https = require('https');

const options = {
  hostname: 'luna-nextjs-website.vercel.app',
  path: '/api/messages',
  method: 'GET'
};

const req = https.request(options, res => {
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

req.end();
