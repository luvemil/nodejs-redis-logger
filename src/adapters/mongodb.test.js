import { dbMaker } from './mongodb';
import config from 'config';

import { MongoClient } from 'mongodb';

const dbConfig = config.get('Backend.dbConfig')

test('hand connection to mongodb', done => {
  const { user, password, dbName } = dbConfig;
  const url = `mongodb://${user}:${password}@localhost:27017/${dbName}?authSource=admin&gssapiServiceName=mongodb`;
  MongoClient.connect(url,(err, db) => {
    expect(err).toBe(null);
    expect(db).toBeDefined();
    expect(db.isConnected).toBeTruthy();
    db.close();
    done();
  });
});

test('adapter connects to mongodb', async () => {
  expect.assertions(2);
  const { user, password, dbName } = dbConfig;
  const { client, dbObj } = await dbMaker(undefined, undefined, user, password, dbName);
  expect(client).toBeDefined();
  expect(client.isConnected()).toBeTruthy();
  client.close();
});

test('add stream', async () => {
  expect.assertions(1);
  const { user, password, dbName } = dbConfig;
  const { client, dbObj } = await dbMaker(undefined, undefined, user, password, dbName);
  try {
    const r = await dbObj.collection('streams').insertOne({name: 'test'})
    expect(r.insertedCount).toBe(1);
  } catch (e) {
    expect(e.code).toBe(11000);
    if ( e.code !== 11000 ) {
      console.error(e);
    }
  }
  client.close();
});

// test('adapter contains dbObj', async () => {
//   expect.assertions(1);
//   const { db } = await dbMaker();
//   expect(db.dbObj).toBeTruthy();
// });
