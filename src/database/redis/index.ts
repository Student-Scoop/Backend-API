import Redis from 'ioredis';

export default new Redis({
	host: process.env.REDIS_HOST,
	port: 10192,
	password: process.env.REDIS_PASSWORD
});
