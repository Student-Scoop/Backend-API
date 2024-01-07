import Expo from 'expo-server-sdk';
import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function followService(
	userId: string,
	followId: string
): Promise<ServiceToController> {
	function isMultipleOf10(number: number) {
		return number % 10 === 0;
	}

	if (userId === followId) return serviceToController('ERROR_FOLLOW_SELF');

	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { followingIDs: true, notificationId: true }
		});

		const followedUser = await prisma.user.findUnique({
			where: { userId: followId },
			select: { followingIDs: true, notificationId: true }
		});

		if (user?.followingIDs.includes(followId)) {
			const userWithUnFollow = await prisma.user.update({
				where: { userId: userId },
				data: { following: { disconnect: { userId: followId } } }
			});

			if (userWithUnFollow) {
				return serviceToController('SUCCESS_UNFOLLOW');
			}

			return;
		} else {
			const userWithFollower = await prisma.user.update({
				where: { userId: userId },
				data: { following: { connect: { userId: followId } } }
			});

			if (userWithFollower) {
				if (
					isMultipleOf10((followedUser?.followingIDs?.length || 0) + 1) ||
					(followedUser?.followingIDs?.length || 0) <= 9
				) {
					if (!Expo.isExpoPushToken(followedUser?.notificationId)) {
						return serviceToController(
							'ERROR_FOLLOW_FOLLOWED_NO_NOTIFCATION_ID'
						);
					}
				}

				return serviceToController('SUCCESS_FOLLOW');
			}
		}
	} catch (e: any) {
		return serviceToController('ERROR_FOLLOW', e);
	}
}
