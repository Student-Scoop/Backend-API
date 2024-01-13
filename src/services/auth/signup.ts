import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { serviceToController, ServiceToController } from '../../util/response';

export default async function signupService(
	name: string,
	email: string,
	password: string,
	username: string
): Promise<ServiceToController> {
	const formattedUsername = username.toLowerCase();

	try {
		if (await prisma.user.findUnique({ where: { email: email } }))
			return serviceToController('ERROR_SIGNUP_EMAIL_ALREADY_EXISTS');

		const user = await prisma.user.create({
			data: {
				name: name,
				email: email,
				username: formattedUsername,
				password: await bcrypt.hash(password, 10),
				portfolio: {}
			}
		});

		if (!user) return serviceToController('ERROR_SIGNUP_USER_NOT_CREATED');

		return serviceToController('SUCCESS_SIGNUP', {
			userId: user.userId,
			email: user.email,
			username: user.username,
			name: user.name,
			imageUri: user.avatar,
			emailIsVerified: user.emailIsVerified,
			verified: user.verified,
			followersCount: user.followersCount?.toString(),
			followingCount: user.followingCount?.toString()
		});
	} catch (e: any) {
		return serviceToController('ERROR_SIGNUP', e);
	}
}
