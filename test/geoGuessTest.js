// geoGuessTest.js Copyright 2020 Paul Beaudet MIT License

const { geoGuess } = require('../geoGuess');

const expectResults = (query, number = 1) => {
  let testStatus = 'fail';
  try {
    const json = geoGuess(query);
    const regex = new RegExp(query, 'g');
    for(let i = 0; i < number; i++){
      if(json?.results?.length === 1 && json.results[i].name.search(regex) === 0){
        testStatus = 'success';
      } else {
        return 'fail';
      }
    }
  } catch (error){
    console.log(`${error}`);
  }
  return testStatus;
};

const findOnExactName = async () => {
  const testStatus = expectResults('Abbotsford');
  console.log(`it can find a place based on exact name: ${testStatus}`);
};

// const findOnPartOfName = async () => {
//   let testStatus = expectResults('Abbo');
//   console.log(`it can find a one unique place based on search parts: ${testStatus}`);
//   testStatus = expectResults('Pré');
//   console.log(`it can find another unique place based on search parts: ${testStatus}`);
// };

// const findMultipleResults = async () => {
//   const testStatus = expectResults('Bea', 3);
//   console.log(`it gives results for search parts that would have multiple possibilities: ${testStatus}`);
// };

// const allTheTest = async () => {
//   findOnExactName();
//   findOnPartOfName();
//   findMultipleResults();
// };

// allTheTest();
findOnExactName();
