import prisma from '../../lib/prisma';
import config from '../../config/env';
import { generateToken } from '../../lib/token';
import { OAuth2Client } from 'google-auth-library';
import { ServiceToController, serviceToController } from '../../util/response';

const client = new OAuth2Client();

export default async function googleLoginService(
	googleToken: string
): Promise<ServiceToController> {
	try {
		const ticket = await client.verifyIdToken({
			idToken: googleToken,
			audience: [
				'294317333146-e1t6m7g4vhal2q5ak56cbovd18c0fuah.apps.googleusercontent.com',
				'294317333146-31btmvp1ltu2pl9jm3lg6gtn9uk0dp3c.apps.googleusercontent.com'
			]
		});

		const payload = ticket.getPayload();

		const associatedUser = await prisma.user.findUnique({
			where: { email: payload['email'] },
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

		if (!associatedUser)
			return serviceToController('ERROR_GOOGLE_LOGIN_USER_NOT_FOUND');

		const token = generateToken(associatedUser.userId, config.SECRET_KEY);

		return serviceToController('SUCCESS_GOOGLE_LOGIN', {
			userId: associatedUser.userId,
			email: associatedUser.email,
			name: associatedUser.name,
			username: associatedUser.username,
			avatar: associatedUser.avatar,
			verified: associatedUser.verified,
			emailVerified: associatedUser.emailIsVerified,
			followersCount: associatedUser.followersIDs?.length.toString(),
			followingCount: associatedUser.followingIDs?.length.toString(),
			portfolio: associatedUser.portfolio,
			createdAt: associatedUser.createdAt,
			updatedAt: associatedUser.updatedAt,
			token: token
		});
	} catch (err: any) {
		return serviceToController('ERROR_GOOGLE_LOGIN');
	}
}
