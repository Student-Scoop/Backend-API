import config from './src/config/env';
import type { Config } from 'drizzle-kit';

export default {
	driver: 'pg',
	schema: './src/database/postgres/schema.ts',
	out: './migrations',
	verbose: true,
	strict: true,
	dbCredentials: {
		connectionString: config.DATABASE_URL as string
	}
} satisfies Config;
