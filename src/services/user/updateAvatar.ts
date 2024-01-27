import prisma from '../../lib/prisma';
import { uploadStream } from '../../lib/cloudinary';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function updateAvatarService(
	userId: string,
	image: any | null
): Promise<ServiceToController> {
	try {
		if (!image) {
			const updatePhoto = await prisma.user.update({
				where: { userId: userId },
				data: { avatar: '' }
			});

			if (!updatePhoto) return serviceToController('ERROR_UPDATE_AVATAR');

			return serviceToController('SUCCESS_UPDATE_AVATAR', { avatarURL: '' });
		}

		const profileImage = await uploadStream('profile_pictures', image);

		const updatePhoto = await prisma.user.update({
			where: { userId: userId },
			data: { avatar: profileImage['secure_url'] }
		});

		if (!updatePhoto) return serviceToController('ERROR_UPDATE_AVATAR');

		return serviceToController('SUCCESS_UPDATE_AVATAR', {
			avatar: profileImage['secure_url']
		});
	} catch (e: any) {
		return serviceToController('ERROR_UPDATE_AVATAR', e);
	}
}
