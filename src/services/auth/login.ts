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
				followersCount: true,
				followingCount: true,
				imageUri: true
			}
		});

		if (!user) return serviceToController('ERROR_LOGIN_INVALID_USERNAME');

		if (!(await bcrypt.compare(password, user.password))) {
			return serviceToController('ERROR_LOGIN_INVALID_PASSWORD');
		}

		const token = generateToken(user.userId, config.SECRET_KEY);

		return serviceToController('SUCCESS_LOGIN', {
			userId: user.userId,
			email: user.email,
			name: user.name,
			username: user.username,
			imageUri: user.imageUri,
			verified: user.verified,
			emailVerified: user.emailIsVerified,
			followersCount: user.followersCount?.toString(),
			followingCount: user.followingCount?.toString(),
			token: token
		});
	} catch (err: any) {
		return serviceToController('ERROR_LOGIN', err);
	}
}
