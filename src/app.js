import redis from 'redis';
import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import config from 'config';

import { db } from './db';
import { api } from './api';

const appConfig = config.get('Backend.app');
const subscriber = redis.createClient();

subscriber.on('pmessage',async (patt,chan,msg) => {
  try {
    await db.add_stream({ name: chan });
    await db.add_message({timestamp: +(new Date()), stream: chan, msg });
  } catch (e) {
    console.error(e);
  }
});

subscriber.psubscribe('stream.*');

const app = new Koa();

app.use(bodyParser());
app.use(mount('/',api));

app.listen(appConfig.port ? appConfig.port : 3000);
