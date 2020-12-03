// createIndex.js Copyright 2020 Paul Beaudet MIT Licence
const fs = require('fs');
const readline = require('readline');
const constants = require('../constants');
const { writeFile } = fs.promises;
const {
  citiesFileLocation,
  tsvKey,
} = constants;
const newFileLocation = `${__dirname}/../locationData/cities_ascii_alpha_index.js`;

const createIndex = () => {
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  let count = 0;
  const index = {};
  let lastIndex = '';
  lineStream.on('line', ( line ) => {
    // skip key line
    if(count === 0){
      count = 1;
      return;
    }
    const tabSep = line.split('\t');
    const name = tabSep[tsvKey.ascii];
    const firstLetter = name[0].toLowerCase();
    if(firstLetter > lastIndex){
      index[firstLetter] = count;
    }
    lastIndex = firstLetter;
    count++;
  });
  lineStream.on('close', () => {
    const indexString = JSON.stringify(index);
    const newFile = `module.exports = ${indexString};\n`
    writeFile(newFileLocation, newFile)
      .then(()=>{
        console.log(JSON.stringify(index));
      }).catch(error => {
        console.log(`${error}`);
      });
  });
}

createIndex();