// constants.js Copyright 2020 Paul Beaudet MIT Licence
const tsvKey = {
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

module.exports = {
  // citiesFileLocation: `${__dirname}/locationData/cities_canada-usa.tsv`, // Version 1
  // citiesFileLocation: `${__dirname}/locationData/cities_alpha.tsv`,      // Version 2
  // citiesFileLocation: `${__dirname}/locationData/cities_deDup.tsv`,      // Version 3
  citiesFileLocation: `${__dirname}/locationData/cities_ascii_alpha.tsv`,   // Version 4
  tsvKey,
};