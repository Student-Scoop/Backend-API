import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getUserService(
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
				followersCount: true,
				followingCount: true,
				following: true,
				avatar: true,
				portfolio: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!user) return serviceToController('ERROR_GET_USER_USER_NOT_FOUND');

		return serviceToController('SUCCESS_GET_USER', {
			userId: user.userId,
			email: user.email,
			username: user.username,
			avatar: user.avatar,
			emailIsVerified: user.emailIsVerified,
			verified: user.verified,
			name: user.name,
			followersCount: user.followersCount?.toString(),
			followingCount: user.followingCount?.toString(),
			portfolio: user.portfolio,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		});
	} catch (e: any) {
		return serviceToController('ERROR_GET_USER', e);
	}
}
