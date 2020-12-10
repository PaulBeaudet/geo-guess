// sort.js Copyright 2020 Paul Beaudet MIT Licence
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import readline from 'readline';
import {
  citiesFileLocation,
  tsvKey,
} from '../constants';
const newFileLocation: string = `${__dirname}/../locationData/cities_ascii_alpha.tsv`;

// returns json that incudes array of guesses
const alphaSort = () => {
  console.time('alphaSort');
  const lineStream = readline.createInterface({
    input: createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  const lineArray: Array<string> = [];
  let keyPropsLine: string = '';
  lineStream.on('line', line => {
    if(keyPropsLine){
      lineArray.push(line);
    } else {
      // take first line as key properties
      keyPropsLine = line;
    }
  });
  lineStream.on('close', () => {
    lineArray.sort((lineA, lineB) => {
      const nameA = lineA.split('\t')[tsvKey.ascii];
      const nameB = lineB.split('\t')[tsvKey.ascii];
      if (nameA < nameB) {
        return -1;
      }
      if (nameB < nameA) {
        return 1;
      }
      return 0;
    });
    let newFile: string = keyPropsLine + '\n';
    lineArray.forEach((line)=>{
      newFile += line + '\n';
    });
    writeFile(newFileLocation, newFile)
      .then(()=>{
        console.timeEnd('alphaSort');
      }).catch(error => {
        console.log(`${error}`);
      });
  });
};

alphaSort();
