import { safe } from '../../lib/errors';
import UserRepo from '../../repository/user';
import { ServiceToController, serviceToController } from '../../util/response';

export const getPortfolioEvents = {
	SUCCESS: 'SUCCESS',
	CANT_GET_USER: 'CANT_GET_USER',
	USER_NOT_FOUND: 'NOT_FOUND'
};

export default async function getPortfolioService(
	userId: string
): Promise<ServiceToController> {
	const userPortfolio = await safe(UserRepo.findUnqiueUser('userId', userId));
	if (userPortfolio.error)
		return serviceToController(getPortfolioEvents.CANT_GET_USER);

	if (!userPortfolio.data)
		return serviceToController(getPortfolioEvents.USER_NOT_FOUND);

	return serviceToController(getPortfolioEvents.SUCCESS, {
		userId: userPortfolio.data.userId,
		username: userPortfolio.data.username,
		avatar: userPortfolio.data.avatar,
		name: userPortfolio.data.name,
		followersCount: userPortfolio.data.followers?.length.toString(),
		followingCount: userPortfolio.data.followers?.length.toString()
	});
}
