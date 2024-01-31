import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getFollowCountsService(
	userId: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { followersIDs: true, followingIDs: true }
		});

		if (!user) return serviceToController('ERROR_GET_FOLLOWS_USER_NOT_FOUND');

		if (user)
			return serviceToController('SUCCESS_GET_FOLLOWS', {
				following: user.followingIDs?.length.toString(),
				followers: user.followersIDs?.length.toString()
			});
	} catch (e: any) {
		return serviceToController('ERROR_GET_FOLLOWS', e);
	}
}
