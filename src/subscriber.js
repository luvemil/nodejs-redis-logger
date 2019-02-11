import redis from 'redis';

const subscriber = redis.createClient();

export const setup_subscriber = (db) => {
  subscriber.on('pmessage',async (patt,chan,msg) => {
    try {
      await db.add_stream({ name: chan });
      await db.add_message({timestamp: +(new Date()), stream: chan, msg: JSON.parse(msg) });
    } catch (e) {
      console.error(e);
    }
  });

  subscriber.psubscribe('stream.*');

  return subscriber;
}
