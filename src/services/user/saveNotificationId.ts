import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function saveNotificationIdService(
	userId: string,
	notificationId: string
): Promise<ServiceToController> {
	try {
		const saveNotification = await prisma.user.update({
			where: { userId: userId },
			data: { notificationId: notificationId }
		});

		if (!saveNotification)
			return serviceToController('ERROR_SAVE_NOTIFICATION_ID');

		return serviceToController('SUCCESS_SAVE_NOTIFICATION_ID');
	} catch (e) {
		return serviceToController('ERROR_SAVE_NOTIFICATION_ID', e);
	}
}
