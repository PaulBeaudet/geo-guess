// endPointTest.js Copyright 2020 Paul Beaudet MIT License
const { request } = require('https');
const querystring = require('querystring');
const testQuery = {
  q: 'Zion',
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
  // console.log('headers:', res.headers);
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