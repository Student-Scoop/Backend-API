import { Response } from 'express';
import { sendResponse } from '../util/response';
import { RequestExtended } from '../types/request';

import {
	changeDataService,
	deleteAccountService,
	getFollowCountsService,
	getNotificationsService,
	getUserService,
	saveNotificationIdService,
	updatePhotoService
} from '../services/user';

export default class UserController {
	static async changeData(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { password, userName, newPassword, name } = req.body;

		const { event, data } = await changeDataService(
			userId,
			password,
			userName,
			newPassword,
			name
		);

		switch (event) {
			case 'SUCCESS_CHANGE_DATA':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_CHANGE_DATA_USER_NOT_FOUND':
				return sendResponse(res, 404, 'User not found');
			case 'ERROR_CHANGE_DATA_INVALID_PASSWORD':
				return sendResponse(res, 400, 'Invalid password');
			case 'ERROR_CHANGE_DATA':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async deleteAccount(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { password } = req.body;

		const { event, data } = await deleteAccountService(userId, password);

		switch (event) {
			case 'SUCCESS_DELETE_ACCOUNT':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_DELETE_ACCOUNT_USER_NOT_FOUND':
				return sendResponse(res, 404, 'User not found');
			case 'ERROR_DELETE_ACCOUNT_INVALID_PASSWORD':
				return sendResponse(res, 400, 'Invalid password');
			case 'ERROR_DELETE_ACCOUNT':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async getFollowCounts(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getFollowCountsService(userId);

		switch (event) {
			case 'SUCCESS_GET_FOLLOWS':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_GET_FOLLOWS_USER_NOT_FOUND':
				return sendResponse(res, 404, 'User not found');
			case 'ERROR_GET_FOLLOWS':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async getNotifications(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getNotificationsService(userId);

		switch (event) {
			case 'SUCCESS_GET_NOTIFICATIONS':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_GET_NOTIFICATIONS':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async getUser(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getUserService(userId);

		switch (event) {
			case 'SUCCESS_GET_USER':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_GET_USER_USER_NOT_FOUND':
				return sendResponse(res, 404, 'User not found');
			case 'ERROR_GET_USER':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async saveNotificationId(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { notificationId } = req.body;

		const { event, data } = await saveNotificationIdService(
			userId,
			notificationId
		);

		switch (event) {
			case 'SUCCESS_SAVE_NOTIFICATION_ID':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_SAVE_NOTIFICATION_ID':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}

	static async updatePhoto(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { photo } = req.body;

		const { event, data } = await updatePhotoService(userId, photo);

		switch (event) {
			case 'SUCCESS_UPDATE_PHOTO':
				return sendResponse(res, 200, 'Success', data);
			case 'ERROR_UPDATE_PHOTO_COULD_NOT_CREATE_ENTRY':
				return sendResponse(res, 500, 'Could not create entry');
			case 'ERROR_UPDATE_PHOTO':
				return sendResponse(res, 500, 'Internal server error');
			default:
				return sendResponse(res, 500, 'Unexpected server error');
		}
	}
}
