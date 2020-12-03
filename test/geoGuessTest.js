// geoGuessTest.js Copyright 2020 Paul Beaudet MIT License
const { geoGuess } = require('../geoGuess');

const fail = 'fail';
const pass = 'success';

const testMsg = (msg, status, reason = '') => {
  console.log(`${status}${reason ? ' => ' : ''}${reason}: ${msg}`);
};

const expectResults = (msg, query, number = 1) => {
  let testStatus = 'fail';
  geoGuess(({results}) => {
    const lowerQuery = query.toLowerCase();
    const regex = new RegExp(lowerQuery, 'g');
    let numberOfResults = 0;
    for(let i = 0; i < number; i++){
      if(results.length && results[i].name && results[i].name.toLowerCase().search(regex) === 0){
        numberOfResults++;
      } else {
        testStatus = 'fail';
        break;
      }
    }
    if(numberOfResults === number){
      testStatus = 'success';
    }
    testMsg(msg, testStatus);
  }, query);
};

const expectUniqueResults = (msg, query) => {
  let testStatus = 'success';
  geoGuess(({results}) => {
    if(!results.length){
      testMsg(msg, 'fail', 'no results');
      return;
    }
    for(let i = 0; i < results.length; i++){
      for(let j = i + 1; j < results.length; j++){
        if(i !== j && results[i].uniqueName === results[j].uniqueName){
          console.dir(results[i]);
          console.dir(results[j]);
          testStatus = 'fail';
          break;
        }
      }
    }
    testMsg(msg, testStatus);
  }, query);
};

const expectAllResultsToBeUnique = (msg) => {
  for(let letter=65; letter<91; letter++){
    const searchChar = String.fromCharCode(letter);
    expectUniqueResults(`${msg}=> ${searchChar}`, searchChar);
  }
}

const expectNoResults = (msg, query) => {
  let testStatus = 'fail';
  geoGuess(({results}) => {
    testStatus = results.length === 0 ? 'success' : 'fail';
    testMsg(msg, testStatus);
  }, query);
};

const expectAScore = (msg, query) => {
  let testStatus = 'success';
  geoGuess(({results}) => {
    for(let i = 0; i < results.length; i++){
      if(!results[i].hasOwnProperty('score')){
        testStatus = 'fail => existence';
        break;
      }
      if (typeof results[i].score !== 'number'){
        testStatus = 'fail => type';
        break;
      }
      if(results[i].score && results[i].score < 1){
        testStatus = 'success';
      } else {
        testStatus = 'fail => range';
        break;
      }
    }
    testMsg(msg, testStatus);
  }, query);
}

const expectConfidence = (msg, query, lat = null, long = null) => {
  let testStatus = 'success';
  geoGuess(({results}) => {
    if(!results.length){
      testMsg(msg, 'wash', 'no results to compare');
      return;
    }
    let lastScore = 0;
    for(let i = 0; i < results.length; i++){
      if(results[i].score && results[i].score < 1){
        if(i  && lastScore <= results[i].score){
          testStatus = 'fail => unexpected order';
          break;
        }
      } else {
        testStatus = 'fail => range';
        break;
      }
      lastScore = results[i].score;
    }
    testMsg(msg, testStatus);
  }, query, lat, long);
}

const expectLatAndLong = (msg, query) => {
  let testStatus = 'fail';
  geoGuess(({results}) => {
    if(!results.length){
      testMsg(msg, 'fail', 'no results');
      return;
    }
    for(let i = 0; i < results.length; i++) {
      if(results[i].lat && results[i].long){
        if(typeof results[i].lat === 'number' && typeof results[i].long === 'number'){
          testStatus = 'success';
        } else {
          testMsg(msg, 'fail', 'props not type number');
          return;  
        }
      } else {
        testMsg(msg, 'fail', 'props not available');
        return;
      } 
    }
    testMsg(msg, testStatus);
  }, query);
}

const allTheTest = async () => {
  expectResults(`it can find a place based on exact name`, 'Abbotsford');
  expectResults(`it can find a one unique place based on search parts`, 'Abbo');
  expectResults(`it can find another unique place based on search parts`, 'Pre');
  expectResults(`it can results based on a lowercase query`, 're');
  expectResults(`it gives results for search parts having multiple possibilities`, 'Bea', 20);
  expectNoResults(`it responds even when there are no results`, 'Zz');
  expectUniqueResults(`It gives unique results for a common place name`, 'Auburn');
  expectUniqueResults(`It gives unique results based on a unique place name`, 'Absecon');
  expectAllResultsToBeUnique(`it has unique name results for query`);
  expectLatAndLong(`it returns lat and long props`, 'Ab');
  expectAScore(`it can return a score`, 'North York');
  expectConfidence(`it can give a scale of confidence without location`, 'Air');
  expectConfidence(`it can give a scale of confidence with location`, 'My', 39.54428, -74.38237);
  expectConfidence(`it can give a scale of confidence with location`, 'Alamo', 37, -120);
};

allTheTest();

