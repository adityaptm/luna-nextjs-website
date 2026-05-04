const http = require('http');

http.get('http://localhost:3002/api/spotify/search?q=Avenged', res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => {
    console.log('Response body:', body);
  });
}).on('error', e => {
  console.error(e);
});
