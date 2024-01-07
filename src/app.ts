import http from 'http';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from './config/env';
import express, { Express, Response } from 'express';

import { createClient } from 'redis';
import RedisStore from 'connect-redis';

import router from './router/router';
import { secureHeaders } from './middleware/security/headers';
import { RequestExtended } from './types/request';

const app: Express = express();

app.disable('x-powered-by');

let redisClient = createClient({
	password: config.REDIS_PASSWORD,
	socket: {
		host: config.REDIS_HOST,
		port: Number(config.REDIS_PORT)
	}
});

redisClient.connect().catch(console.error);
redisClient.on('ready', () => console.log('✅ Redis is ready'));
redisClient.on('error', (err) => console.error('🟥 Redis error:', err));

let redisStore = new RedisStore({
	client: redisClient,
	prefix: 'student-scoop:'
});

const server = http.createServer(app);
export const sessionMiddleWare = session({
	secret: config.SECRET_KEY as string,
	resave: false,
	store: redisStore,
	saveUninitialized: false
});

cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
});

app.use(secureHeaders);
app.use(sessionMiddleWare);
app.use(bodyParser.json());

app.use('/api', router);

export default server;
