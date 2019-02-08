import { MongoClient } from 'mongodb';

// Instructions on https://docs.mongodb.com/manual/
// and http://mongodb.github.io/node-mongodb-native/3.1/

const dbMaker = async (url = "mongodb://127.0.0.1:27017", dbName = 'default' ) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const dbObj = client.db(dbName);
    return setup_db_api(dbObj);
  } catch(e) {
    console.error(e.stack);
  }
}

const setup_db_api = dbObj => {
  const db = { dbObj };
  return db;
}

export { dbMaker };
