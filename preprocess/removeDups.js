// removeDups.js Copyright 2020 Paul Beaudet MIT Licence
// NOTE: assumes alphabetically sorted list
const fs = require('fs');
const readline = require('readline');
const {
  citiesFileLocation,
  tsvKey,
} = require('../constants');
const { writeFile } = fs.promises;
const newFileLocation = `${__dirname}/../locationData/cities_deDup.tsv`;

// returns json that incudes array of guesses
const deDup = () => {
  console.time('deDup');
  const lineStream = readline.createInterface({
    input: fs.createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  const lineArray = [];
  let keyPropsLine = '';
  lineStream.on('line', line => {
    if(keyPropsLine){
      lineArray.push(line);
    } else {
      // take first line as key properties
      keyPropsLine = line;
    }
  });
  lineStream.on('close', () => {
    let similarEntries = [];
    const deDuppedLines = lineArray.filter((line)=> {
      const tabSep = line.split('\t');
      const name = tabSep[tsvKey.name];
      const uniqueName = `${name} ${tabSep[tsvKey.a1]} ${tabSep[tsvKey.country]}`;
      const record = {name, uniqueName};
      let keep = true;
      if(similarEntries.length){
        similarEntries.forEach((entry) => {
          if(entry.uniqueName === uniqueName){
            keep = false;
          }
        });
        if(similarEntries[similarEntries.length - 1].name === name ){
          similarEntries.push(record);
        } else {
          similarEntries = [record];
        }
      } else {
        similarEntries.push(record);
      }
      return keep;
    });
    let newFile = keyPropsLine + '\n';
    deDuppedLines.forEach((line)=>{
      newFile += line + '\n';
    });
    writeFile(newFileLocation, newFile)
      .then(()=>{
        console.timeEnd('deDup');
      }).catch(error => {
        console.log(`${error}`);
      });
  });
};

deDup();
