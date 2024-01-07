import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function getNotificationsService(
	userId: string
): Promise<ServiceToController> {
	try {
		const notifications = await prisma.notification.findMany({
			where: { userId: userId },
			include: {
				notifUser: {
					select: {
						username: true,
						imageUri: true,
						userId: true,
						name: true,
						verified: true
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		if (!notifications) return serviceToController('ERROR_GET_NOTIFICATIONS');

		return serviceToController('SUCCESS_GET_NOTIFICATIONS', {
			notifications
		});
	} catch (e: any) {
		return serviceToController('ERROR_GET_NOTIFICATIONS', e);
	}
}
