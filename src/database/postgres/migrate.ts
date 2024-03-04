import database from './';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

migrate(database, { migrationsFolder: 'migrations' })
	.then(() => {
		console.log('Migrations complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Migrations failed!', err);
		process.exit(1);
	});
