import Koa from 'koa';
import Router from 'koa-router';
import { db } from './db';

const router = new Router();

/*
 * GET /streams/:stream_name/messages
 */

router.get('/streams/:stream_name/messages', async ctx => {
  const stream = `stream.${ctx.params.stream_name}`;
  ctx.body = await db.get_messages({ stream });
})

/*
 * GET /streams
 */

router.get('/streams', async ctx => {
  const streams = await db.streams.find({});
  ctx.body = streams;
})

/*
 * POST /streams
 */

router.post('/streams', async ctx => {
  const { name } = ctx.request.body;

  try {
    await db.streams.insert({ name });
  } catch(err) {
    if (err.errorType !== 'uniqueViolated') {
      console.error(err);
    }
  }

  ctx.body = { name };
})

const api = new Koa();

api.use(router.routes());
api.use(router.allowedMethods());

export { api };
