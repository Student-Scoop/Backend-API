import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
	ENV: process.env.NODE_ENV,
	HOST: process.env.HOST || '0.0.0.0',
	PORT: process.env.PORT || 5000,
	MONGO_URI: process.env.DATABASE_URL,
	SECRET_KEY: process.env.SECRET_KEY,

	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD
};
