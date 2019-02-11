import { db } from './db';

test('db successful connection', async () => {
  expect.assertions(2);
  const { client } = await db;
  expect(client).toBeDefined();
  expect(client.isConnected()).toBeTruthy();
  client.close();
});
