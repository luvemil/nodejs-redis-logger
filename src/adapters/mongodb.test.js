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
  const { client, dbObj } = dbMaker(undefined, undefined, user, password, dbName);
  const c = await client;
  expect(c).toBeDefined();
  expect(c.isConnected()).toBeTruthy();
  await c.close();
});

test('add stream', async () => {
  expect.assertions(1);
  const { user, password, dbName } = dbConfig;
  const { client, dbObj } = dbMaker(undefined, undefined, user, password, dbName);
  try {
    const db = await dbObj;
    const r = await db.collection('streams').insertOne({name: 'stream.test'})
    expect(r.insertedCount).toBe(1);
  } catch (e) {
    expect(e.code).toBe(11000);
    if ( e.code !== 11000 ) {
      console.error(e);
    }
  }
  const c = await client;
  await c.close();
});

test('add messages', async () => {
  expect.assertions(4);
  const test_messages = [
    {text: 'henlo', price: 22, note: null},
    {text: 'roger', price: 12},
    {text: 'cd', price: 1, note: 'buy'},
    {text: 'henlo', price: 17, note: 'sell'}
  ];
  const json_messages = test_messages.map((row) => JSON.stringify(row));
  const { user, password, dbName } = dbConfig;
  const db = dbMaker(undefined, undefined, user, password, dbName);
  const streamName = 'stream.test';
  try {
    await expect(db.add_stream({ name: streamName})).resolves.toBeTruthy();
    await expect(Promise.all(json_messages.map((msg, i) => db.add_message({timestamp: i, stream: streamName, msg}))))
      .resolves.toBeTruthy();
    // TODO: add code to verify that the stream and the messages were actually added
    // First attempt (not working):
    // const messages = await db.get_messages({ stream: streamName});
    // expect(length(messages)).toBe(length(test_messages));
    const d = await db.dbObj;
    await expect(d.collection('streams').deleteOne({ name: streamName})).resolves.toBeTruthy();
    await expect(d.collection('messages').deleteMany({ stream: streamName})).resolves.toBeTruthy();
  } catch(e) {
    expect(e).toBeNull();
  }
  const c = await db.client;
  return await c.close();
});

test('add messages in object form', async () => {
  expect.assertions(4);
  const test_messages = [
    {text: 'henlo', price: 22, note: null, ar: [1,2,3,4]},
    {text: 'roger', price: 12, ar: [0,0,1,0]},
    {text: 'cd', price: 1, note: 'buy', ar: [1,0,0,0]},
    {text: 'henlo', price: 17, note: 'sell', ar: [0,0,0,1]}
  ];
  const { user, password, dbName } = dbConfig;
  const db = dbMaker(undefined, undefined, user, password, dbName);
  const streamName = 'stream.testraw';
  try {
    await expect(db.add_stream({ name: streamName})).resolves.toBeTruthy();
    await expect(Promise.all(test_messages.map((msg, i) => db.add_message({timestamp: i, stream: streamName, msg}))))
      .resolves.toBeTruthy();
    const d = await db.dbObj;
    await expect(d.collection('streams').deleteOne({ name: streamName})).resolves.toBeTruthy();
    await expect(d.collection('messages').deleteMany({ stream: streamName})).resolves.toBeTruthy();
  } catch(e) {
    expect(e).toBeNull();
  }
  const c = await db.client;
  return await c.close();
});

test('retrieve messages with db.get_messages', async () => {
  expect.assertions(1);
  const { user, password, dbName } = dbConfig;
  const db = dbMaker(undefined, undefined, user, password, dbName);
  const streamName = 'stream.subscriber.test'; // stream filled somewhere else
  try {
    const res = await db.get_messages({stream: streamName})
    expect(res.length).toBe(4);
  } catch(e) {
    console.error(e.stack);
    expect(e).toBeNull();
  }
  const c = await db.client;
  return await c.close();
});

// test('adapter contains dbObj', async () => {
//   expect.assertions(1);
//   const { db } = await dbMaker();
//   expect(db.dbObj).toBeTruthy();
// });
