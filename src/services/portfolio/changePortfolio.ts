import prisma from '../../lib/prisma';
import { Clubs, Sports } from '../../types/user';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function changePortfolioService(
	userId: string,
	schoolName: string,
	schoolLocation: string,
	graduationYear: string,
	degree: string,
	major: string,
	clubs: Clubs[],
	sports: Sports[]
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
				schoolName: schoolName,
				graduationYear: graduationYear,
				schoolLocation: schoolLocation,
				degree: degree,
				major: major,
				sports: {},
				clubs: {}
			}
		});

		if (!portfolio)
			return serviceToController('ERROR_CHANGE_PORTFOLIO_PORTFOLIO_NOT_FOUND');

		return serviceToController('SUCCESS_CHANGE_PORTFOLIO');
	} catch (e: any) {
		console.log(e);
		return serviceToController('ERROR_CHANGE_PORTFOLIO');
	}
}
