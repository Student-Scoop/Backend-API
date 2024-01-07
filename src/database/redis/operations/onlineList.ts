import redis from '../';

export async function getOnlineList() {
	try {
		return await redis.lrange('online', 0, -1);
	} catch (e) {
		return e;
	}
}

export async function addToRedis(id: string) {
	try {
		const existingIds = await redis.lrange('online', 0, -1);

		if (!existingIds.includes(id)) {
			const onlineUsers = await redis.rpush('online', id);

			if (onlineUsers) return await redis.lrange('online', 0, -1);
		} else {
			return existingIds;
		}
	} catch (e) {
		return e;
	}
}

export async function removeFromRedis(id: string) {
	try {
		const removedCount = await redis.lrem('online', 0, id);

		if (removedCount) return await redis.lrange('online', 0, -1);
	} catch (e) {
		return e;
	}
}
