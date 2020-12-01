// geoGuessTest.js Copyright 2020 Paul Beaudet MIT License
const { geoGuess } = require('../geoGuess');

const expectResults = (msg, query, number = 1) => {
  let testStatus = 'fail';
  geoGuess((json) => {
    const regex = new RegExp(query, 'g');
    for(let i = 0; i < number; i++){
      if(json?.results?.length && json.results[i].name.search(regex) === 0){
        testStatus = 'success';
      } else {
        testStatus = 'fail';
        break;
      }
    }
    console.log(`${msg}: ${testStatus}`);
  }, query);
};

const allTheTest = async () => {
  expectResults(`it can find a place based on exact name`, 'Abbotsford');
  expectResults(`it can find a one unique place based on search parts`, 'Abbo');
  expectResults(`it can find another unique place based on search parts`, 'Pré');
  expectResults(`it gives results for search parts having multiple possibilities`, 'Bea', 20);
};

allTheTest();
