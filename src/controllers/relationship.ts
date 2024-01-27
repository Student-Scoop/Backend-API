import { Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '../util/response';
import { RequestExtended } from '../types/request';

import {
	followService,
	unfollowService,
	getFollowersService,
	getFollowingService,
	randomFollowersService,
	searchUserService
} from '../services/relationship';

export default class RelationshipController {
	static async follow(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { followId } = req.body;

		const { event, data } = await followService(userId, followId);

		switch (event) {
			case 'SUCCESS_FOLLOW':
				return sendResponse(res, httpStatus.OK, '', data);
			case 'SUCCESS_UNFOLLOW':
				return sendResponse(res, httpStatus.OK, '', data);
			case 'ERROR_FOLLOW_SELF':
				return sendResponse(
					res,
					httpStatus.BAD_REQUEST,
					'You cannot follow yourself'
				);
			case 'ERROR_FOLLOW_FOLLOWED_NO_NOTIFCATION_ID':
				return sendResponse(
					res,
					httpStatus.FAILED_DEPENDENCY,
					'User followed, unable to push notification'
				);
			case 'ERROR_FOLLOW':
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

	static async unfollow(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { unfollowId } = req.query;

		const { event, data } = await unfollowService(userId, unfollowId as string);

		switch (event) {
			case 'SUCCESS_UNFOLLOW':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_UNFOLLOW':
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

	static async getFollowers(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const take = Number(req.query.take) || 10;
		const skip = Number(req.query.skip) || 0;

		const { event, data } = await getFollowersService(userId, take, skip);

		switch (event) {
			case 'SUCCESS_GET_FOLLOWERS':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_GET_FOLLOWERS':
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

	static async getFollowing(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const take = Number(req.query.take) || 10;
		const skip = Number(req.query.skip) || 0;

		const { event, data } = await getFollowingService(userId, take, skip);

		switch (event) {
			case 'SUCCESS_GET_FOLLOWING':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_GET_FOLLOWING':
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

	static async randomFollowers(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await randomFollowersService(userId);

		switch (event) {
			case 'SUCCESS_RANDOM_FOLLOWERS':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_RANDOM_FOLLOWERS':
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

	static async searchUser(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { query } = req.query;

		if ((query as string).trim() === '')
			return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid query');

		const { event, data } = await searchUserService(userId, query as string);

		switch (event) {
			case 'SUCCESS_USER_SEARCH':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_USER_SEARCH':
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
