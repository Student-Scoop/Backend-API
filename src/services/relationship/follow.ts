import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function followService(
	userId: string,
	followId: string
): Promise<ServiceToController> {
	if (userId === followId) return serviceToController('ERROR_FOLLOW_SELF');

	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { followingIDs: true, followersIDs: true }
		});

		const followedUser = await prisma.user.findUnique({
			where: { userId: followId },
			select: { followingIDs: true, followersIDs: true }
		});

		if (user?.followingIDs.includes(followId)) {
			const userWithUnFollow = await prisma.user.update({
				where: { userId: userId },
				data: { following: { disconnect: { userId: followId } } }
			});

			if (userWithUnFollow) {
				return serviceToController('SUCCESS_UNFOLLOW', {
					followingCount: followedUser?.followingIDs.length,
					followersCount: followedUser?.followersIDs.length
				});
			}

			return;
		} else {
			const userWithFollower = await prisma.user.update({
				where: { userId: userId },
				data: { following: { connect: { userId: followId } } }
			});

			const followedUser = await prisma.user.findUnique({
				where: { userId: followId },
				select: { followingIDs: true, followersIDs: true }
			});

			if (userWithFollower) {
				return serviceToController('SUCCESS_FOLLOW', {
					followingCount: followedUser?.followingIDs.length,
					followersCount: followedUser?.followersIDs.length
				});
			}
		}
	} catch (e: any) {
		return serviceToController('ERROR_FOLLOW', e);
	}
}
