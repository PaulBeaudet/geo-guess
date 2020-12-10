// createIndex.js Copyright 2020 Paul Beaudet MIT Licence
import { writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import readline from 'readline';
import {
  citiesFileLocation,
  tsvKey,
} from '../constants';
const newFileLocation: string = `${__dirname}/../../locationData/cities_ascii_alpha_index.js`;

const createIndex = () => {
  const lineStream = readline.createInterface({
    input: createReadStream(citiesFileLocation),
    output: process.stdout,
    terminal: false,
  });
  let count: number = 0;
  const index: any = {};
  let lastIndex: string = '';
  lineStream.on('line', ( line ) => {
    // skip key line
    if(count === 0){
      count = 1;
      return;
    }
    const tabSep: Array<string> = line.split('\t');
    const name: string = tabSep[tsvKey.ascii];
    const firstLetter: string = name[0].toLowerCase();
    if(firstLetter > lastIndex){
      index[firstLetter] = count;
    }
    lastIndex = firstLetter;
    count++;
  });
  lineStream.on('close', () => {
    const indexString: string = JSON.stringify(index);
    const newFile: string = `module.exports = ${indexString};\n`
    writeFile(newFileLocation, newFile)
      .then(()=>{
        console.log(JSON.stringify(index));
      }).catch(error => {
        console.log(`${error}`);
      });
  });
}

createIndex();