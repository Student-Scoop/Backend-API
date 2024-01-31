import { Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '../util/response';
import { RequestExtended } from '../types/request';

import {
	changeDataService,
	getFollowCountsService,
	getUserService,
	updateAvatarService
} from '../services/user';

export default class UserController {
	static async changeData(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { password, username, newPassword, name } = req.body;

		const { event, data } = await changeDataService(
			userId,
			name,
			username,
			password,
			newPassword
		);

		switch (event) {
			case 'SUCCESS_CHANGE_DATA':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_CHANGE_DATA_USER_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'User not found');
			case 'ERROR_CHANGE_DATA_INVALID_PASSWORD':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid password');
			case 'ERROR_CHANGE_DATA':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error'
				);
		}
	}

	static async updateAvatar(req: RequestExtended, res: Response) {
		if (!req.file)
			return sendResponse(res, httpStatus.BAD_REQUEST, 'No file was uploaded.');

		const { userId } = req.user;

		const { event, data } = await updateAvatarService(userId, req.file);

		switch (event) {
			case 'SUCCESS_UPDATE_AVATAR':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_UPDATE_AVATAR':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error'
				);
		}
	}

	static async removeAvatar(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await updateAvatarService(userId, null);

		switch (event) {
			case 'SUCCESS_UPDATE_AVATAR':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_UPDATE_AVATAR':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error'
				);
		}
	}

	static async getFollowCounts(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getFollowCountsService(userId);

		switch (event) {
			case 'SUCCESS_GET_FOLLOWS':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_GET_FOLLOWS_USER_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'User not found');
			case 'ERROR_GET_FOLLOWS':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error'
				);
		}
	}

	static async getUser(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		let getUserId: string;
		if (req.params.id && req.params.id.toLowerCase() === '@me') {
			getUserId = userId;
		} else {
			getUserId = req.params.id;
		}

		const { event, data } = await getUserService(getUserId);

		switch (event) {
			case 'SUCCESS_GET_USER':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_GET_USER_USER_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'User not found');
			case 'ERROR_GET_USER':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error'
				);
		}
	}
}
