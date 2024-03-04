import { Response } from 'express';
import httpStatus from 'http-status';
import { TypedRequest } from '../types/request';
import { CreateResponse } from '../util/response';

import {
	changeDataService,
	changeDataEvents,
	getFollowCountsService,
	getFollowCountsEvents,
	getUserService,
	getUserEvents,
	updateAvatarService,
	updateAvatarEvents,
	getPortfolioService,
	getPortfolioEvents
} from '../services/user';

interface ChangeDataRequest {
	name: string;
	username: string;
	password: string;
	newPassword: string;
}

export default class UserController {
	static async changeData(
		req: TypedRequest<{}, {}, ChangeDataRequest>,
		res: Response
	) {
		const { userId } = req.user;
		const { name, username, password, newPassword } = req.body;

		const { event, data } = await changeDataService(
			userId,
			name,
			username,
			password,
			newPassword
		);

		let r = new CreateResponse(res);

		switch (event) {
			case changeDataEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case changeDataEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case changeDataEvents.INVALID_PASSWORD:
				return r.code(httpStatus.BAD_REQUEST).msg('Invalid password.').send();
			case changeDataEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could get user.')
					.send();
			case changeDataEvents.COULD_NOT_UPDATE_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not update user.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async updateAvatar(req: TypedRequest<{}, {}, {}>, res: Response) {
		let r = new CreateResponse(res);

		if (!req.file)
			return r.code(httpStatus.BAD_REQUEST).msg('No file uploaded.').send();

		const { userId } = req.user;
		const { event, data } = await updateAvatarService(userId, req.file);

		switch (event) {
			case updateAvatarEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case updateAvatarEvents.COULD_NOT_UPDATE_AVATAR:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not update avatar.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async removeAvatar(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;
		const { event, data } = await updateAvatarService(userId, null);

		let r = new CreateResponse(res);

		switch (event) {
			case updateAvatarEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case updateAvatarEvents.COULD_NOT_UPDATE_AVATAR:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not remove avatar.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getFollowCounts(req: TypedRequest<{}, {}, {}>, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getFollowCountsService(userId);

		console.log('RETURN', event, data);

		let r = new CreateResponse(res);

		switch (event) {
			case getFollowCountsEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getFollowCountsEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getFollowCountsEvents.CANT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get user.')
					.send();
			case getFollowCountsEvents.CANT_GET_FOLLOWERS:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get followers.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getPortfolio(
		req: TypedRequest<{}, { id: string }, {}>,
		res: Response
	) {
		const { userId } = req.user;

		let getUserId: string;
		if (req.params.id && req.params.id.toLowerCase() === '@me') {
			getUserId = userId;
		} else {
			getUserId = req.params.id;
		}

		const { event, data } = await getPortfolioService(getUserId);

		let r = new CreateResponse(res);

		switch (event) {
			case getPortfolioEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getPortfolioEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getPortfolioEvents.CANT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get portfolio.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}

	static async getUser(
		req: TypedRequest<{}, { id: string }, {}>,
		res: Response
	) {
		const { userId } = req.user;

		let getUserId: string;
		if (req.params.id && req.params.id.toLowerCase() === '@me') {
			getUserId = userId;
		} else {
			getUserId = req.params.id;
		}

		const { event, data } = await getUserService(getUserId);

		let r = new CreateResponse(res);

		switch (event) {
			case getUserEvents.SUCCESS:
				return r.code(httpStatus.OK).payload(data).send();
			case getUserEvents.USER_NOT_FOUND:
				return r.code(httpStatus.NOT_FOUND).msg('User not found.').send();
			case getUserEvents.COULD_NOT_GET_USER:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Could not get user.')
					.send();
			default:
				return r
					.code(httpStatus.INTERNAL_SERVER_ERROR)
					.msg('Unexpected server error.')
					.send();
		}
	}
}
