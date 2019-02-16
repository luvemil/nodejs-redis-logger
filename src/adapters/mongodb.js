import { MongoClient } from 'mongodb';

// Instructions on https://docs.mongodb.com/manual/
// and http://mongodb.github.io/node-mongodb-native/3.1/

const dbMaker = ( host = 'localhost', port = '27017', user, password, dbName = 'default' ) => {
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
    const initSetupPromise = setup_collections(client_connect,dbName);
    const clientPromise = client_connect();
    const dbPromise = clientPromise.then(client => client.db(dbName));
    return { client: clientPromise, dbObj: dbPromise, ...setup_db_api(clientPromise, dbPromise) };
  } catch(e) {
    console.error(e.stack);
  }
}

// setup_collection creates its client and destroys it later
const setup_collections = async (client_connect, dbName) => {
  try {
    const client = await client_connect();
    const db = client.db(dbName);
    const streams = await db.createCollection('streams');
    await streams.createIndex({name: 1}, {unique: true});
    const messages = await db.createCollection('messages');
    await messages.createIndex({timestamp: 1});
    return client.close();
  } catch (e) {
    console.error(e.stack);
  }
}

const add_to_collection = async (dbPromise, collectionName, row) => {
  try {
    const db = await dbPromise;
    const collection = await db.collection(collectionName);
    return await collection.insertOne(row);
  } catch(e) {
    if ( e.code !== 11000 ) { // error code for unique index violation
      console.error(e);
      return false;
    }
  }
  return true; // FIXME: does this line get ever executed?
}

const get_from_collection = async (dbPromise, collectionName, search) => {
  const db = await dbPromise;
  const collection = await db.collection(collectionName);
  const res = await collection.find(search);
  return res.toArray();
}

const setup_db_api = (clientPromise, dbPromise) => {
  return {
    add_stream: row => add_to_collection(dbPromise,'streams',row),
    get_streams: search => get_from_collection(dbPromise,'streams',search),
    add_message: row => add_to_collection(dbPromise,'messages',row),
    get_messages: search => get_from_collection(dbPromise,'messages',search)
  };
}

export { dbMaker };
