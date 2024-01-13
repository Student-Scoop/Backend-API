import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function searchUserService(
	userId: string,
	query: string
): Promise<ServiceToController> {
	try {
		const people = await prisma.user.findMany({
			where: {
				OR: [
					{ username: { contains: query?.toString(), mode: 'insensitive' } },
					{ name: { contains: query?.toString(), mode: 'insensitive' } }
				]
			},
			select: {
				name: true,
				username: true,
				userId: true,
				avatar: true
			},
			orderBy: { userId: 'desc' },
			take: 15
		});

		const loggedInUser = await prisma.user.findUnique({
			where: { userId: userId },
			select: { followingIDs: true }
		});

		let updatedUsers: Array<{
			userId: string;
			username: string;
			isFollowed: boolean;
			avatar: string | null;
		}> = [];

		if (loggedInUser) {
			const usersWithFollowStatus = people.map((user) => {
				const isFollowed = loggedInUser.followingIDs.includes(user.userId);
				return { ...user, isFollowed };
			});

			updatedUsers = usersWithFollowStatus;
		}

		if (!people) return serviceToController('ERROR_USER_SEARCH_NOT_FOUND');

		return serviceToController('SUCCESS_USER_SEARCH', updatedUsers);
	} catch (e: any) {
		return serviceToController('ERROR_USER_SEARCH', e);
	}
}
