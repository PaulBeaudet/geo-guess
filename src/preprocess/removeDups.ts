// removeDups.js Copyright 2020 Paul Beaudet MIT Licence
// NOTE: assumes alphabetically sorted list
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import readline from 'readline';
import {
  citiesFileLocation,
  tsvKey,
} from '../constants';
const newFileLocation: string = `${__dirname}/../../locationData/cities_deDup.tsv`;

interface recordI {
  name: string,
  uniqueName: string,
}

// returns json that incudes array of guesses
const deDup = () => {
  console.time('deDup');
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
    let similarEntries: Array<recordI> = [];
    const deDuppedLines: Array<string> = lineArray.filter((line)=> {
      const tabSep: Array<string> = line.split('\t');
      const name: string = tabSep[tsvKey.name];
      const uniqueName: string = `${name} ${tabSep[tsvKey.a1]} ${tabSep[tsvKey.country]}`;
      const record: recordI = {name, uniqueName};
      let keep: boolean = true;
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
    let newFile: string = keyPropsLine + '\n';
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
