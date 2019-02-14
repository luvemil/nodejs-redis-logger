import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import config from 'config';

import { db as dbPromise } from './db';
import { api } from './api';
import { setup_subscriber } from './subscriber';

console.log('Starting nodejs-logger');
const appConfig = config.get('Backend.app');
let subscriber;
dbPromise.then(db => {
  subscriber = setup_subscriber(db);
});

const app = new Koa();

app.use(bodyParser());
app.use(mount('/',api));

app.listen(appConfig.port ? appConfig.port : 3000);
