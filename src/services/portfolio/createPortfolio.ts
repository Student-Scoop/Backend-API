import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function createPortfolioService(
	userId: string,
	schoolName: string,
	schoolLocation: string,
	graduationYear: string,
	degree: string,
	major: string
): Promise<ServiceToController> {
	try {
		const portfolioFound = await prisma.user.findUnique({
			where: { userId: userId },
			select: { portfolioId: true }
		});

		if (!portfolioFound.portfolioId)
			return serviceToController('ERROR_CREATE_PORTFOLIO_PORTFOLIO_EXISTS');

		const portfolio = await prisma.portfolio.create({
			data: {
				userId: userId,
				schoolName: schoolName,
				graduationYear: graduationYear,
				schoolLocation: schoolLocation,
				degree: degree,
				major: major,
				clubs: {},
				sports: {}
			}
		});

		if (!portfolio)
			return serviceToController('ERROR_CREATE_PORTFOLIO_PORTFOLIO_NOT_FOUND');

		const user = await prisma.user.update({
			where: { userId: userId },
			data: { portfolioId: portfolio.portfolioId }
		});

		if (!user)
			return serviceToController(
				'ERROR_CREATE_PORTFOLIO_UPDATE_USER_PORTFOLIO_ID'
			);

		return serviceToController('SUCCESS_CREATE_PORTFOLIO');
	} catch (e: any) {
		console.log(e);
		return serviceToController('ERROR_CREATE_PORTFOLIO');
	}
}
