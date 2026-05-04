require('dotenv').config({ path: '.env.local' });
const { searchTracks } = require('./src/lib/spotify');

async function test() {
  const res = await searchTracks('Avenged');
  console.log(JSON.stringify(res, null, 2));
}

test();
