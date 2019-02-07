const config = require('config');

const dbConfig = config.get('Backend.dbConfig');

let db;

switch (dbConfig.adapter) {
  case 'nedb':
    console.log("Using nedb adapter");
    db = require('./adapters/nedb.js').db;
    break;
  default:
    console.log("No adapter selected");
}

export { db };
