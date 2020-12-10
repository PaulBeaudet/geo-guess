// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
import fs from 'fs';
import readline from 'readline';
import GeoPoint from 'geopoint';
import {
  citiesFileLocation,
  tsvKey,
  tsvIndex,
} from './constants';

interface resultI {
  name: string,
  uniqueName: string,
  lat: number,
  long: number,
  score: number,
}

interface internalResultI extends resultI {
  pop: number,
  dist?: number,
}

interface resultsI {
  results: Array<resultI>
}

// returns sorted list of guesses based on population
const popConfidence = (results: Array<internalResultI>) => {
  if(results.length === 1){
    return [{
      ...results[0],
      score: 0.9,
    }]
  }
  if(!results.length){
    return [];
  }
  results = results.map(( results ) => {
    return {
      ...results,
      pop: results.pop,
    }
  })
  results.sort((a, b)=> {
    if(a.pop > b.pop){
      return -1;
    }
    if(a.pop < b.pop){
      return 1;
    }
    return 0;
  });
  results = results.map(( result, index ) => {
    const score = index ? result.pop / results[0].pop: 0.9;
    return {
      ...result,
      score: Number(score.toFixed(2)), 
    }
  });
  return results;
};

// returns sorted list of guesses based on location
const geoConfidence = (results: Array<internalResultI>, lat: number, long: number) => {
  if(results.length === 1){
    return [{
      ...results[0],
      score: 0.9,
    }]
  }
  if(!results.length){
    return [];
  }
  const userPoint = new GeoPoint(lat, long, false);
  const distArray = results.map((result)=> {
    const guessPoint = new GeoPoint(result.lat, result.long, false); 
    return {
      ...result,
      dist: Number(userPoint.distanceTo(guessPoint, false)),
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

interface resultCallback {
  (results: resultsI): void
}

// returns json that incudes array of guesses
const geoGuess = (
  resultCb: resultCallback, 
  query: string,
  lat: string | number | null = null,
  long: string | number | null = null
) => {
  let suggestions: Array<internalResultI> = [];
  if(!query){
    resultCb({results: suggestions});
    return;
  }
  const lowerQuery = query.toLowerCase();
  const regex = new RegExp(lowerQuery, 'g');
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  let found = false;
  let stopStream = false;
  let lineCount = 0;
  const onEnd = () => {
    if(found){
      stopStream = true;
      lineStream.close();
      if(lat && long){
        suggestions = geoConfidence(suggestions, Number(lat), Number(long));
      } else {
        suggestions = popConfidence(suggestions);
      }
      const endResults:Array<resultI> = suggestions.map((result)=>{
        return {
          name: result.name,
          uniqueName: result.uniqueName,
          lat: result.lat,
          long: result.long,
          score: result.score,
        };
      })
      resultCb({
        results: endResults
      });
    }
  }
  lineStream.on('line', ( line ) => {
    // don't do anything until we are in the ballpark
    if(lineCount < tsvIndex[lowerQuery[0]]){
      lineCount++;
      return;
    }
    if(stopStream){
      return;
    }
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.ascii];
    const lowerName = name.toLowerCase();
    if(lowerName.search(regex) === 0){
      suggestions.push({
        name,
        uniqueName: `${name} ${tabSep[tsvKey.a1]} ${tabSep[tsvKey.country]}`,
        lat: Number(tabSep[tsvKey.lat]),
        long: Number(tabSep[tsvKey.long]),
        score: 0.01,
        pop: Number(tabSep[tsvKey.population]),
      });
      found = true;
    } else {
      // last match found last line
      onEnd();
    }
  });
  lineStream.on('close', () => {
    if(!found){
      resultCb({results: suggestions});
    } else if(lowerQuery[0] === 'z'){
      onEnd();
    }
  });
};

interface lambdaEvent {
  queryStringParameters: {
    q: string,
    latitude: string,
    longitude: string,
  }
}

interface lambdaResponse {
  statusCode: number,
  headers: {
    'Content-type': string
  },
  body: string,
}

interface lambdaCallback {
  (firstParam: null, response: lambdaResponse): void;
}

const lambdaHandler = (event: lambdaEvent, context: null, callback: lambdaCallback ) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-type': 'application/json',
    },
    body: '',
  }
  if(!event.queryStringParameters){
    response.body = 'no query';
    callback(null, response);
  }
  const { 
    q,
    latitude,
    longitude,
   } = event.queryStringParameters;
  const query = q;
  const lat = latitude ? latitude : null;
  const long = longitude ? longitude : null;
  geoGuess((results: resultsI) => {
    response.body = JSON.stringify(results);
    callback(null, response);
  }, query, lat, long);
}

export {
  geoGuess,
  lambdaHandler,
};
