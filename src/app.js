import redis from 'redis';
import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';

import { db } from './db';
import { api } from './api';

const subscriber = redis.createClient();

subscriber.on('pmessage',async (patt,chan,msg) => {
  console.log(`{ ptn: ${patt}, chan: ${chan}, msg: ${msg} }`);

  await db.add_stream({ name: chan });
  await db.add_message({timestamp: +(new Date()), stream: chan, msg });
});

subscriber.psubscribe('stream.*');

const app = new Koa();

app.use(bodyParser());
app.use(mount('/',api));

app.listen(3000);
