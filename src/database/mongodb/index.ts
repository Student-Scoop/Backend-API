import { MongoClient } from 'mongodb';
import config from '../../config/env';

const client = new MongoClient(config.MONGO_URI);
export const userCollection = client.db().collection('User');
