// endPointTest.js Copyright 2020 Paul Beaudet MIT License
const { request } = require('https');
const querystring = require('querystring');
const testQuery = {
  q: process.argv[4] || 'er',
}
const latitude = process.argv[5];
const longitude = process.argv[6];
if(latitude && longitude){
  testQuery.latitude = latitude;
  testQuery.longitude = longitude;
}

const query = querystring.stringify(testQuery);
console.log(query);
const hostname = process.argv[2];
const path = `${process.argv[3]}?${query}`;

const options = {
  hostname,
  port: 443,
  path,
  method: 'GET'
};

console.time('endPointTest');
const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  res.on('data', (data) => {
    process.stdout.write(data);
    console.log();
    console.timeEnd('endPointTest');
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();