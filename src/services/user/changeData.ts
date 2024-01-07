import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function changeDataService(
	userId: string,
	name: string,
	username: string,
	password: string,
	newPassword: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { userId: true, password: true }
		});

		if (!user) return serviceToController('ERROR_CHANGE_DATA_USER_NOT_FOUND');

		if (!(await bcrypt.compare(password, user.password)))
			return serviceToController('ERROR_CHANGE_DATA_INVALID_PASSWORD');

		const updatedUser = await prisma.user.update({
			where: { userId: userId },
			data: {
				name: name || undefined,
				password: newPassword ? await bcrypt.hash(newPassword, 10) : undefined,
				username: username ? username.trim() : undefined
			}
		});

		if (updatedUser) return serviceToController('SUCCESS_CHANGE_DATA');
	} catch (e: any) {
		return serviceToController('ERROR_CHANGE_DATA', e);
	}
}
