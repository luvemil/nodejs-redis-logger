import { MongoClient } from 'mongodb';

// Instructions on https://docs.mongodb.com/manual/
// and http://mongodb.github.io/node-mongodb-native/3.1/

const dbMaker = async ( host = 'localhost', port = '27017', user, password, dbName = 'default' ) => {
  const auth_part = user ? `${user}:${password}@` : '';
  const auth_post = user ? "?authSource=admin&gssapiServiceName=mongodb" : "";
  const url = `mongodb://${auth_part}${host}:${port}/${auth_post}`;

  const client_connect = () => new Promise(function(resolve, reject) {
    MongoClient.connect(url,(err,client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    })
  })

  try {
    const client = await client_connect();
    const db = await client.db(dbName);
    return { client, dbObj: db, ...setup_db_api(db) };
  } catch(e) {
    console.error(e.stack);
  }
  client.close();
}

const setup_db_api = dbObj => {
  const db = {};
  return db;
}

export { dbMaker };
