import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
	ENV: process.env.NODE_ENV,
	HOST: process.env.HOST || '0.0.0.0',
	PORT: process.env.PORT || 5000,
	DATABASE_URL: process.env.DATABASE_URL,
	API_SUB_URL: process.env.API_SUB_URL,

	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,

	PUBLIC_SECRET_KEY: process.env.PUBLIC_SECRET_KEY,
	PRIVATE_SECRET_KEY: process.env.PRIVATE_SECRET_KEY,

	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};
