// geoGuessTest.js Copyright 2020 Paul Beaudet MIT License
const { geoGuess } = require('../geoGuess');

const expectResults = (msg, query, number = 1) => {
  let testStatus = 'fail';
  geoGuess((json) => {
    const regex = new RegExp(query, 'g');
    let numberOfResults = 0;
    for(let i = 0; i < number; i++){
      if(json?.results?.length && json.results[i]?.name.search(regex) === 0){
        numberOfResults++;
      } else {
        testStatus = 'fail';
        break;
      }
    }
    if(numberOfResults === number){
      testStatus = 'success';
    }
    console.log(`${msg}: ${testStatus}`);
  }, query);
};

const expectUniqueResults = (msg, query, number = 1) => {
  let testStatus = 'success';
  geoGuess((json) => {
    if(!json?.results?.length){
      console.log(`${msg}: fail => no results`);
      return;
    }
    for(let i = 0; i < json.results.length; i++){
      for(let j = 0; j < json.results.length; j++){
        if(json.results[i].name === json.results[j].name){
          testStatus = 'fail';
          break;
        }
      }
    }
    console.log(`${msg}: ${testStatus}`);
  }, query);
};

const expectNoResults = (msg, query) => {
  let testStatus = 'fail';
  geoGuess((json) => {
    testStatus = json?.results?.length === 0 ? 'success' : 'fail';
    console.log(`${msg}: ${testStatus}`);
  }, query);
};

const allTheTest = async () => {
  expectResults(`it can find a place based on exact name`, 'Abbotsford');
  expectResults(`it can find a one unique place based on search parts`, 'Abbo');
  expectResults(`it can find another unique place based on search parts`, 'Pré');
  expectResults(`it gives results for search parts having multiple possibilities`, 'Bea', 20);
  expectNoResults(`it responds even when there are no results`, 'Zz');
  expectUniqueResults(`It gives unique results for a common place name`, 'Auburn');
};

allTheTest();