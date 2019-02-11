import { db as dbPromise } from './db';
import { setup_subscriber } from './subscriber';
import redis from 'redis';

let subscriber;
let publisher;
let db;

beforeEach(async () => {
  db = await dbPromise;
  subscriber = setup_subscriber(db);
  publisher = redis.createClient();
  return subscriber
});

test('saves messages', async (done) => {
  const test_messages = [
    {text: 'henlo', price: 22, note: null},
    {text: 'roger', price: 12},
    {text: 'cd', price: 1, note: 'buy'},
    {text: 'henlo', price: 17, note: 'sell'}
  ];
  const json_messages = test_messages.map(row => JSON.stringify(row));
  const streamName = 'stream.subscriber.test';

  json_messages.forEach(row => { publisher.publish(streamName,row); });

  try {
    const res = await db.get_messages({stream:streamName});
    expect(res.length).toBe(test_messages.length);
    
    // CLEANUP
    await expect(db.dbObj.collection('messages').deleteMany({stream: streamName})).resolves.toBeTruthy();
    done();
  } catch(e) {
    console.error(e.stack);
    expect(e).toBeNull();
  }
});
