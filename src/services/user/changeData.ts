import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function changeDataService(
	userId: string,
	name: string,
	username: string,
	password: string,
	newPassword: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { userId: true, password: true }
		});

		if (!user) return serviceToController('ERROR_CHANGE_DATA_USER_NOT_FOUND');

		if (
			password &&
			password.length > 0 &&
			!(await bcrypt.compare(password, user.password))
		)
			return serviceToController('ERROR_CHANGE_DATA_INVALID_PASSWORD');

		const updatedUser = await prisma.user.update({
			where: { userId: userId },
			data: {
				name: name || undefined,
				password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
				username: username ? username.trim() : undefined
			},
			select: {
				userId: true,
				name: true,
				username: true,
				email: true,
				verified: true,
				emailIsVerified: true,
				avatar: true,
				portfolio: true,
				createdAt: true,
				updatedAt: true,
				followersIDs: true,
				followingIDs: true
			}
		});

		if (updatedUser)
			return serviceToController('SUCCESS_CHANGE_DATA', {
				userId: updatedUser.userId,
				email: updatedUser.email,
				username: updatedUser.username,
				avatar: updatedUser.avatar,
				emailIsVerified: updatedUser.emailIsVerified,
				verified: updatedUser.verified,
				name: updatedUser.name,
				followersCount: updatedUser.followersIDs?.length.toString(),
				followingCount: updatedUser.followingIDs?.length.toString(),
				portfolio: updatedUser.portfolio,
				createdAt: updatedUser.createdAt,
				updatedAt: updatedUser.updatedAt
			});
	} catch (e: any) {
		return serviceToController('ERROR_CHANGE_DATA', e);
	}
}
