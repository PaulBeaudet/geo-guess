// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
const fs = require('fs');
const readline = require('readline');

const citiesFileLocation = `${__dirname}/locationData/cities_canada-usa.tsv`;

const tsvKey = {
  id: 0,
  name: 1,
};

// returns json that incudes array of guesses
const geoGuess = (resultCb, query, long = null, lat = null) => {
  console.log(`Geo guess, searching for ${query} @ ${long} by ${lat}`);
  console.time(query);
  const guesses = {
    results: [],
  };
  const regex = new RegExp(query, 'g');
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  lineStream.on('line', line => {
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.name];
    if(name.search(regex) === 0){
      guesses.results.push({name});
    }
  });
  lineStream.on('close', () => {
    console.timeEnd(query);
    resultCb(guesses);
  });
};

module.exports = {
  geoGuess,
};
