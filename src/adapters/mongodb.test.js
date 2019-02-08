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
    db.close()
    done();
  });
});

test('adapter connects to mongodb', async () => {
  const { user, password } = dbConfig;
  const db = await dbMaker(undefined, undefined, dbConfig.user, dbConfig.password, dbConfig.dbName);
  expect(db).toBeDefined();
  expect(db.dbObj).toBeDefined();
  db.dbObj.close();
});

// test('adapter contains dbObj', async () => {
//   expect.assertions(1);
//   const { db } = await dbMaker();
//   expect(db.dbObj).toBeTruthy();
// });
