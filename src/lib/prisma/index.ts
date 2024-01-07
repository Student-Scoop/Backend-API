import config from '../../config/env';
import { PrismaClient } from '@prisma/client';

export default new PrismaClient({
	log: config.ENV === 'production' ? [] : ['error']
});
