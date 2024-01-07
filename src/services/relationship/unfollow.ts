import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function unfollowService(
	userId: string,
	unfollowId: string
): Promise<ServiceToController> {
	try {
		const userWithFollower = await prisma.user.update({
			where: { userId: userId },
			data: { following: { disconnect: { userId: unfollowId } } }
		});

		if (userWithFollower) {
			/*updateFollowerCounts(userId)
				.then(() => console.log('Follower counts updated'))
				.catch((error) => {
					return serviceToController('ERROR_UNFOLLOW', error);
				});

			updateFollowerCounts(unfollowId)
				.then(() => console.log('Follower counts updated'))
				.catch((error) => {
					return serviceToController('ERROR_UNFOLLOW', error);
				});*/
		}

		return serviceToController('SUCCESS_UNFOLLOW');
	} catch (e: any) {
		return serviceToController('ERROR_UNFOLLOW', e);
	}
}
