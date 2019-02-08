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
  const { user, password, dbName } = dbConfig;
  const { client, dbObj } = await dbMaker(undefined, undefined, user, password, dbName);
  expect(client).toBeDefined();
  expect(client.isConnected()).toBeTruthy();
  client.close();
});

test('create collection', async () => {
  const { user, password, dbName } = dbConfig;
  const { client, dbObj } = await dbMaker(undefined, undefined, user, password, dbName);
  try {
    const r = await dbObj.collection('test').insertMany([{a:2}, {a:3}]);
    expect(r.insertedCount).toBe(2);
  } catch(e) {
    expect(e).toBeNull();
    console.error(e.stack);
  }
  await client.close();
  expect(client.isConnected()).toBeFalsy();
})

// test('adapter contains dbObj', async () => {
//   expect.assertions(1);
//   const { db } = await dbMaker();
//   expect(db.dbObj).toBeTruthy();
// });
