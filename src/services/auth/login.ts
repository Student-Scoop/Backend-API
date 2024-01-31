import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import config from '../../config/env';
import { generateToken } from '../../lib/token';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function loginService(
	username: string,
	password: string
): Promise<ServiceToController> {
	const loweredUsername = username.toLowerCase();

	try {
		const user = await prisma.user.findUnique({
			where: { username: loweredUsername },
			select: {
				userId: true,
				email: true,
				name: true,
				username: true,
				password: true,
				verified: true,
				emailIsVerified: true,
				followersIDs: true,
				followingIDs: true,
				avatar: true,
				portfolio: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!user) return serviceToController('ERROR_LOGIN_INVALID_USERNAME');

		const comparePassword = await bcrypt.compare(
			password,
			user.password.trim()
		);

		if (!comparePassword)
			return serviceToController('ERROR_LOGIN_INVALID_PASSWORD');

		const token = generateToken(user.userId, config.SECRET_KEY);

		return serviceToController('SUCCESS_LOGIN', {
			userId: user.userId,
			email: user.email,
			name: user.name,
			username: user.username,
			avatar: user.avatar,
			verified: user.verified,
			emailVerified: user.emailIsVerified,
			followersCount: user.followersIDs?.length.toString(),
			followingCount: user.followingIDs?.length.toString(),
			portfolio: user.portfolio,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			token: token
		});
	} catch (err: any) {
		return serviceToController('ERROR_LOGIN', err);
	}
}
