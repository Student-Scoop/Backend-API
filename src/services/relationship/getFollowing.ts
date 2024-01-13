import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getFollowingService(
	userId: string,
	take: number,
	skip: number
): Promise<ServiceToController> {
	try {
		const following = await prisma.user.findUnique({
			where: { userId: userId },
			select: {
				following: {
					select: {
						userId: true,
						name: true,
						username: true,
						avatar: true,
						verified: true
					},
					take: Number(take),
					skip: Number(skip)
				}
			}
		});

		if (!following) return serviceToController('ERROR_GET_FOLLOWING');

		return serviceToController('SUCCESS_GET_FOLLOWING', following.following);
	} catch (e: any) {
		return serviceToController('ERROR_GET_FOLLOWING', e);
	}
}
