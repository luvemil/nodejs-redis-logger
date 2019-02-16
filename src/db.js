const config = require('config');

const dbConfig = config.get('Backend.dbConfig');

let db;

switch (dbConfig.adapter) {
  case 'nedb':
    console.log("Using nedb adapter");
    db = require('./adapters/nedb.js').db;
    break;
  case 'mongodb':
    console.log("Using mongodb adapter");
    db = require('./adapters/mongodb.js').dbMaker(undefined, undefined, dbConfig.user, dbConfig.password, dbConfig.dbName);
    break;
  default:
    console.log("No adapter selected");
}

export { db };
