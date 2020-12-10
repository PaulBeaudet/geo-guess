// sortTest.js Copyright 2020 Paul Beaudet MIT Licence
import { createReadStream } from 'fs';
import readline from 'readline';
import {
  citiesFileLocation,
  tsvKey,
} from '../../constants';

// returns json that incudes array of guesses
const itIsAlphaSort = (msg: string) => {
  console.time('alpha');
  let testStatus: string = 'success';
  const lineStream = readline.createInterface({
    input: createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  let lastEntry: string = '';
  let lineNumber: number = 0;
  lineStream.on('line', line => {
    const tabSep: Array<string> = line.split('\t');
    const name: string = tabSep[tsvKey.name];
    if(lastEntry > name && lineNumber > 1){
      testStatus = 'fail';
    }
    lastEntry = name;
    lineNumber++;
  });
  lineStream.on('close', () => {
    console.log(`${msg}: ${testStatus}`)
    console.timeEnd('alpha');
  });
};

itIsAlphaSort('it has an alphabetically sorted list of city names');