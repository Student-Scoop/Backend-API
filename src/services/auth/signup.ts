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
				password: await bcrypt.hash(password, 10)
			}
		});

		const userPortfolio = await prisma.portfolio.create({
			data: {
				userId: user.userId,
				schoolName: '',
				schoolLocation: '',
				graduationYear: '',
				degree: '',
				major: '',
				gpa: 0,
				gradeLevel: 0,
				sports: '',
				clubs: ''
			}
		});

		if (!user || !userPortfolio)
			return serviceToController('ERROR_SIGNUP_USER_NOT_CREATED');

		const syncPortfolio = await prisma.user.update({
			where: { userId: user.userId },
			data: { portfolioId: userPortfolio.portfolioId }
		});

		if (!syncPortfolio)
			return serviceToController('ERROR_SIGNUP_PORTFOLIO_NOT_SYNCED');

		return serviceToController('SUCCESS_SIGNUP', {
			userId: user.userId,
			email: user.email,
			username: user.username,
			name: user.name,
			imageUri: user.avatar,
			emailIsVerified: user.emailIsVerified,
			verified: user.verified,
			followersCount: user.followersIDs?.length.toString(),
			followingCount: user.followingIDs?.length.toString(),
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		});
	} catch (e: any) {
		return serviceToController('ERROR_SIGNUP', e);
	}
}
