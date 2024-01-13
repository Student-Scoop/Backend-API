import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function randomFollowersService(
	userId: string
): Promise<ServiceToController> {
	try {
		const allUsers = await prisma.user.findMany({
			orderBy: { userId: 'desc' },
			select: {
				userId: true,
				name: true,
				username: true,
				avatar: true
			},
			take: 15
		});

		let uniqueNumbers: Array<number> = [];

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
			const usersWithFollowStatus = allUsers.map((user) => {
				const isFollowed = loggedInUser.followingIDs.includes(user.userId);
				return { ...user, isFollowed };
			});

			updatedUsers = usersWithFollowStatus;
		}

		if (allUsers.length > 2) {
			const numbers = Array.from({ length: allUsers.length - 1 }, (_, i) => i);
			const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
		} else if (allUsers.length === 2) {
			uniqueNumbers = [0, 1];
		} else if (allUsers.length === 1) {
			uniqueNumbers = [0];
		}

		const randomPeople: Array<{
			userId: string;
			username: string;
			isFollowed: boolean;
			avatar: string | null;
		}> = [];

		for (let i in uniqueNumbers) {
			const filteredPeople = updatedUsers.filter(
				(users, idx) => idx == uniqueNumbers[i] && users.userId !== userId
			);

			randomPeople.push(...filteredPeople);
		}

		return serviceToController('SUCCESS_GET_RANDOM_FOLLOWERS', randomPeople);
	} catch (e: any) {
		return serviceToController('ERROR_GET_RANDOM_FOLLOWERS', e);
	}
}
