import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { ServiceToController, serviceToController } from '../../util/response';

export default async function deleteAccountService(
	userId: string,
	password: string
): Promise<ServiceToController> {
	try {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: { password: true }
		});

		if (!user)
			return serviceToController('ERROR_DELETE_ACCOUNT_USER_NOT_FOUND');

		if (!(await bcrypt.compare(password, user?.password as string)))
			return serviceToController('ERROR_DELETE_ACCOUNT_INVALID_PASSWORD');

		const deletedUser = await prisma.user.delete({
			where: { userId: userId }
		});

		if (deletedUser) return serviceToController('SUCCESS_DELETE_ACCOUNT');
	} catch (e: any) {
		return serviceToController('ERROR_DELETE_ACCOUNT', e);
	}
}
