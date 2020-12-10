// constants.js Copyright 2020 Paul Beaudet MIT Licence
import tsvIndex from './cities_ascii_alpha_index';
import { resolve } from 'path';

interface tsvKeyI {
  id: number,
  name: number,
  ascii: number,
  alt_name: number,
  lat: number,
  long: number,
  featClass: number,
  featCode: number,
  country: number,
  cc2: number,
  a1: number,
  a2: number,
  a3: number,
  a4: number,
  population: number,
  elevation: number,
  dem: number,
  timezone: number,
  mod_at: number,
};

const tsvKey: tsvKeyI = {
  id: 0,
  name: 1,
  ascii: 2,
  alt_name: 3,
  lat: 4,
  long: 5,
  featClass: 6,
  featCode: 7,
  country: 8,
  cc2: 9,
  a1: 10,
  a2: 11,
  a3: 12,
  a4: 13,
  population: 14,
  elevation: 15,
  dem: 16,
  timezone: 17,
  mod_at: 18,
};

// citiesFileLocation: `${__dirname}/locationData/cities_canada-usa.tsv`,      // Version 1
// citiesFileLocation: `${__dirname}/locationData/cities_alpha.tsv`,           // Version 2
// citiesFileLocation: `${__dirname}/locationData/cities_deDup.tsv`,           // Version 3
const citiesFileLocation: string = resolve(`./locationData/cities_ascii_alpha.tsv`);   // Version 4

export {
  citiesFileLocation,
  tsvKey,
  tsvIndex,
};