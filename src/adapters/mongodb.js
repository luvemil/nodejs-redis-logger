import { MongoClient } from 'mongodb';

// Instructions on https://docs.mongodb.com/manual/
// and http://mongodb.github.io/node-mongodb-native/3.1/

const dbMaker = async ( host = 'localhost', port = '27017', user, password, dbName = 'default' ) => {
  const auth_part = user ? `${user}:${password}@` : '';
  const auth_post = user ? "?authSource=admin&gssapiServiceName=mongodb" : "";
  const url = `mongodb://${auth_part}${host}:${port}/${dbName}${auth_post}`;

  const client_connect = () => new Promise(function(resolve, reject) {
    MongoClient.connect(url,(err,db) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    })
  })

  try {
    const dbObj = await client_connect();
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
