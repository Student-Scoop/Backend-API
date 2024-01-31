import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getPortfolioService(
	userId: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: {
				userId: true,
				name: true,
				username: true,
				email: true,
				verified: true,
				emailIsVerified: true,
				followers: true,
				following: true,
				followersIDs: true,
				followingIDs: true,
				avatar: true,
				portfolio: true
			}
		});

		if (!user) return serviceToController('ERROR_GET_USER_USER_NOT_FOUND');

		return serviceToController('SUCCESS_GET_PORTFOLIO', {
			userId: user.userId,
			email: user.email,
			username: user.username,
			avatar: user.avatar,
			emailIsVerified: user.emailIsVerified,
			verified: user.verified,
			name: user.name,
			followersCount: user.followersIDs?.length.toString(),
			followingCount: user.followingIDs?.length.toString(),
			portfolio: user.portfolio
		});
	} catch (e: any) {
		return serviceToController('ERROR_GET_USER', e);
	}
}
