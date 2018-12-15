import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
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
 * Mostly for debug purposes, this resource should not be exposed to the unauthorized user in production
 */

router.get('/streams', async ctx => {
  const streams = await db.streams.find({});
  ctx.body = streams;
})

const api = new Koa();

api.use(cors({ origin: '*' }));
api.use(router.routes());
api.use(router.allowedMethods());

export { api };
