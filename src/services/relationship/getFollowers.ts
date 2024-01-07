import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getFollowersService(
	userId: string,
	take: number,
	skip: number
): Promise<ServiceToController> {
	try {
		const followers = await prisma.user.findUnique({
			where: { userId: userId },
			select: {
				followingIDs: true,
				followers: {
					select: {
						userId: true,
						name: true,
						username: true,
						imageUri: true,
						verified: true
					},
					take: Number(take),
					skip: Number(skip)
				}
			}
		});

		if (!followers) return serviceToController('ERROR_GET_FOLLOWERS');

		const usersWithFollowStatus = followers.followers.map((user) => {
			const isFollowed = followers.followingIDs.includes(user.userId);
			return { ...user, isFollowed };
		});

		return serviceToController('SUCCESS_GET_FOLLOWERS', usersWithFollowStatus);
	} catch (e) {
		return serviceToController('ERROR_GET_FOLLOWERS', e);
	}
}
