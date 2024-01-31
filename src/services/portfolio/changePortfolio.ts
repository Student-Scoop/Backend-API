import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function changePortfolioService(
	userId: string,
	schoolName: string,
	schoolLocation: string,
	graduationYear: string,
	degree: string,
	major: string,
	clubs: string,
	sports: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { portfolioId: true }
		});

		if (!user)
			return serviceToController('ERROR_CHANGE_PORTFOLIO_USER_NOT_FOUND');

		const portfolio = await prisma.portfolio.update({
			where: { portfolioId: user.portfolioId },
			data: {
				schoolName: schoolName || undefined,
				graduationYear: graduationYear || undefined,
				schoolLocation: schoolLocation || undefined,
				degree: degree || undefined,
				major: major || undefined,
				sports: clubs || undefined,
				clubs: sports || undefined
			},
			select: {
				schoolName: true,
				schoolLocation: true,
				graduationYear: true,
				degree: true,
				major: true,
				sports: true,
				clubs: true
			}
		});

		if (!portfolio)
			return serviceToController('ERROR_CHANGE_PORTFOLIO_PORTFOLIO_NOT_FOUND');

		return serviceToController('SUCCESS_CHANGE_PORTFOLIO', {
			schoolName: portfolio.schoolName,
			schoolLocation: portfolio.schoolLocation,
			graduationYear: portfolio.graduationYear,
			degree: portfolio.degree,
			major: portfolio.major,
			sports: portfolio.sports,
			clubs: portfolio.clubs
		});
	} catch (e: any) {
		console.log(e);
		return serviceToController('ERROR_CHANGE_PORTFOLIO');
	}
}
