import app from './app';
import config from './config/env';

app.listen(Number(config.PORT) || 5000, config.HOST, (): void =>
	console.log(`🚀 Student Scoop server started: ${config.HOST}:${config.PORT}`)
);
