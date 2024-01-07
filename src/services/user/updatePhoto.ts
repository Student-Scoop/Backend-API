import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function updatePhotoService(
	userId: string,
	imageUri: string
): Promise<ServiceToController> {
	try {
		const photos = await prisma.user.update({
			where: { userId: userId },
			data: { imageUri: imageUri }
		});

		if (!photos)
			serviceToController('ERROR_UPDATE_PHOTO_COULD_NOT_CREATE_ENTRY');

		return serviceToController('SUCCESS_UPDATE_PHOTO');
	} catch (e: any) {
		return serviceToController('ERROR_UPDATE_PHOTO', e);
	}
}
