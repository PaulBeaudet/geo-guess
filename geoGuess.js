// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
const fs = require('fs');
const readline = require('readline');
const {
  citiesFileLocation,
  tsvKey,
} = require('./constants');


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
  let found = false;
  let stopStream = false;
  lineStream.on('line', line => {
    if (stopStream){
      return;
    }
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.name];
    if(name.search(regex) === 0){
      guesses.results.push({
        name,
        uniqueName: `${name} ${tabSep[tsvKey.a1]} ${tabSep[tsvKey.country]}`,
        lat: Number(tabSep[tsvKey.lat]),
        long: Number(tabSep[tsvKey.long]),
      });
      found = true;
    } else {
      // last match found last line
      if(found){
        stopStream = true;
        lineStream.close();
        console.timeEnd(query);
        resultCb(guesses);
      }
    }
  });
  lineStream.on('close', () => {
    if(!found){
      resultCb(guesses);
    }
  });
};

module.exports = {
  geoGuess,
};
