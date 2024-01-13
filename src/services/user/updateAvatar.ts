import prisma from '../../lib/prisma';
import { uploadStream } from '../../lib/cloudinary';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function updateAvatarService(
	userId: string,
	image: any
): Promise<ServiceToController> {
	try {
		const profileImage = await uploadStream('profile_pictures', image);

		console.log(profileImage['secure_url']);

		const updatePhoto = await prisma.user.update({
			where: { userId: userId },
			data: { avatar: profileImage['secure_url'] }
		});

		return serviceToController('SUCCESS_UPDATE_AVATAR', {
			avatarURL: profileImage['secure_url']
		});
	} catch (e: any) {
		return serviceToController('ERROR_UPDATE_AVATAR', e);
	}
}
