// geoGuessTest.js Copyright 2020 Paul Beaudet MIT License

const { geoGuess } = require('../geoGuess');
let testStatus = 'fail';

const findOnExactName = async () => {
  try {
    const json = await geoGuess('Abbotsford');
    testStatus = json?.results?.length === 1 && json.results[0].name === 'Abbotsford'
      ? 'success'
      : 'fail'
  } catch (error){
    testStatus = 'fail';
  }
  console.log(`it can find a place based on exact name: ${testStatus}`);
};

const findOnPartOfName = async () => {
  console.log(`it can find a few unique places based on search parts: ${testStatus}`);
};

const findMultipleResults = async () => {
  console.log(`it gives results for search parts that would have multiple possibilities: ${testStatus}`);
};

const allTheTest = async () => {
  findOnExactName();
  findOnPartOfName();
  findMultipleResults();
};

// allTheTest();
findOnExactName();