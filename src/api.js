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
  let ts_query = ctx.query.fromTs == null ? null : { $gt: +ctx.query.fromTs } ;
  ts_query = ctx.query.toTs == null ? ts_query : { $lt: +ctx.query.toTs, ...ts_query };
  ts_query = ts_query == null ? null : { timestamp: ts_query };
  const search_query = {
    stream,
    ...ts_query
  };
  ctx.body = await db.get_messages(search_query);
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
