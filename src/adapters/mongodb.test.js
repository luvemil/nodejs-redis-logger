import { dbMaker } from './mongodb';
import config from 'config';

import { MongoClient } from 'mongodb';

const dbConfig = config.get('Backend.dbConfig')

test('hand connection to mongodb', done => {
  const { user, password, dbname } = dbConfig;
  const url = `mongodb://${user}:${password}@localhost:27017/${dbname}?authSource=admin&gssapiServiceName=mongodb`;
  MongoClient.connect(url,(err, db) => {
    expect(err).toBe(null);
    expect(db).toBeDefined();
    db.close()
    done();
  });
});

// test('connects to mongodb', async () => {
//   const { user, password } = dbConfig;
//   const res = await dbMaker(`mongodb://${user}:${password}@localhost:27017`);
//   expect(res).toBeDefined();
//   expect(res.db).toBeDefined();
// });

// test('adapter contains dbObj', async () => {
//   expect.assertions(1);
//   const { db } = await dbMaker();
//   expect(db.dbObj).toBeTruthy();
// });
