import Koa from 'koa';
import mount from 'koa-mount';
import bodyParser from 'koa-bodyparser';
import config from 'config';

import { db } from './db';
import { api } from './api';
import { setup_subscriber } from './subscriber';

const appConfig = config.get('Backend.app');
const subscriber = setup_subscriber(db);

const app = new Koa();

app.use(bodyParser());
app.use(mount('/',api));

app.listen(appConfig.port ? appConfig.port : 3000);
