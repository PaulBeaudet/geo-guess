// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
const fs = require('fs');
const readline = require('readline');

const citiesFileLocation = `${__dirname}/locationData/cities_mod.tsv`;

const tsvKey = {
  id: 0,
  name: 1,
};

// returns json that incudes array of guesses
const geoGuess = (query, long = null, lat = null) => {
  console.log(`Geo guess, searching for ${query} @ ${long} by ${lat}`);
  console.time('geoGuess');
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  lineStream.on('line', line => {
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.name];
    if(name === query){
      console.log(name);
    }
  });
  lineStream.on('close', () => {
    console.timeLog('geoGuess', `finished read: ${citiesFileLocation}`);
  });
  const guesses = {
    results: [],
  };
  fs.createReadStream(citiesFileLocation);
  return guesses;
};

module.exports = {
  geoGuess,
};
