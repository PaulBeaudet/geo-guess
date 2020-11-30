// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
const parse = require('csv-parse');
const fs = require('fs');

const tsvKey = {
  id: 0,
  name: 1,
};

// returns json that incudes array of guesses
const geoGuess = (query, long = null, lat = null) => {
  return new Promise((resolve, reject)=> {
    console.log(`Geo guess, searching for ${query} @ ${long} by ${lat}`);
    const guesses = {
      results: [],
    };
    const parser = parse({delimiter: `\t`}, (error, data) => {
      if(error){
        console.log(error);
        reject(error);
      } else {
        console.log(data)
      }
    });
    fs.createReadStream(`${__dirname}/locationData/cities_mod.tsv`).pipe(parser);
    resolve(guesses);
  });
}

module.exports = {
  geoGuess,
}
