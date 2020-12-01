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
};

allTheTest();