import { db } from './db';

test('db successful connection', async () => {
  expect.assertions(2);
  const client = await db.client;
  expect(client).toBeDefined();
  expect(client.isConnected()).toBeTruthy();
  client.close();
});
