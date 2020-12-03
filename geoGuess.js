// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
const fs = require('fs');
const readline = require('readline');
const GeoPoint = require('geopoint');
const constants = require('./constants');
const {
  citiesFileLocation,
  tsvKey,
} = constants;



// returns sorted list of guesses
const geoConfidence = (results, lat, long) => {
  if(results.length === 1){
    return [{
      ...results[0],
      score: 0.9,
    }]
  }
  if(!results.length){
    return [];
  }
  const userPoint = new GeoPoint(lat, long);
  const distArray = results.map((result)=> {
    const guessPoint = new GeoPoint(result.lat, result.long); 
    return {
      ...result,
      dist: userPoint.distanceTo(guessPoint),
    }
  });
  distArray.sort((a, b)=> {
    if(a.dist < b.dist){
      return -1;
    }
    if(a.dist > b.dist){
      return 1;
    }
    return 0;
  });
  const furthestDist = distArray[distArray.length - 1].dist;
  const shortestDist = distArray[0].dist;
  let score = 0.99;
  if(shortestDist){
    score = shortestDist / furthestDist - 1;
    score = Math.abs(Number(score.toFixed(2)))
  }
  const newResults = [{
    ...distArray[0],
    score
  }];
  // for everything in between, if there is any
  for(let i = 1; i < distArray.length - 1; i++){
    score = distArray[i].dist / furthestDist - 1;
    score = Math.abs(Number(score.toFixed(2)));
    newResults.push({
      ...distArray[i],
      score
    });
  }
  score = shortestDist ? shortestDist / furthestDist : 0.01;
  score = Math.abs(Number(score.toFixed(2)));
  newResults.push({
    ...distArray[distArray.length - 1],
    score,
  });
  return newResults
}


// returns json that incudes array of guesses
const geoGuess = (resultCb, query, lat = null, long = null) => {
  console.log(`Geo guess, searching for ${query} @ ${lat} by ${long}`);
  // console.time(query);
  const guesses = {
    results: [],
  };
  if(!query){
    resultCb(guesses);
    return;
  }
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
        score: 0.01,
      });
      found = true;
    } else {
      // last match found last line
      if(found){
        stopStream = true;
        lineStream.close();
        // console.timeEnd(query);
        if(lat && long){
          resultCb({
            results: geoConfidence(guesses.results, lat, long),
          });
        } else {
          resultCb(guesses);
        }
      }
    }
  });
  lineStream.on('close', () => {
    if(!found){
      resultCb(guesses);
    }
  });
};

const lambdaHandler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-type': 'application/json',
    },
  }
  if(!event.queryStringParameters){
    response.body('no query');
    callback(null, response);
  }
  const { queryStringParameters } = event;
  const query = queryStringParameters.q;
  const lat = queryStringParameters.latitude ? queryStringParameters.latitude : null;
  const long = queryStringParameters.longitude ? queryStringParameters.longitude : null;
  geoGuess((json) => {
    response.body = JSON.stringify(json);
    callback(null, response);
  }, query, lat, long);
}

module.exports = {
  geoGuess,
  lambdaHandler,
};
