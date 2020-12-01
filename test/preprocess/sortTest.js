// sortTest.js Copyright 2020 Paul Beaudet MIT Licence

const fs = require('fs');
const readline = require('readline');
const {
  citiesFileLocation,
  tsvKey,
} = require('../../constants');

// returns json that incudes array of guesses
const itIsAlphaSort = (msg) => {
  console.time('alpha');
  let testStatus = 'success';
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  let lastEntry = '';
  let lineNumber = 0;
  lineStream.on('line', line => {
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.name];
    if(lastEntry > name && lineNumber > 1){
      testStatus = 'fail';
    }
    lastEntry = name;
    lineNumber++;
  });
  lineStream.on('close', () => {
    console.log(`${msg}: ${testStatus}`)
    console.timeEnd('alpha');
  });
};

itIsAlphaSort('it has an alphabetically sorted list of city names');