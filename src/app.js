import redis from 'redis';
import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';

import { db } from './db';
import { api } from './api';

const subscriber = redis.createClient();

subscriber.on('pmessage',async (patt,chan,msg) => {
  console.log(`{ ptn: ${patt}, chan: ${chan}, msg: ${msg} }`);

  try {
    await db.streams.insert({ name: chan });
  } catch(err) {
    if (err.errorType !== 'uniqueViolated') {
      console.error(err);
    }
  }

  await db.messages.insert({timestamp: +(new Date()), stream: chan, msg });
});

subscriber.psubscribe('stream.*');

const app = new Koa();

app.use(bodyParser());
app.use(mount('/api/test',api));

app.listen(3000);
