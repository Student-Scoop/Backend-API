import { Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '../util/response';
import { RequestExtended } from '../types/request';

import {
	changePortfolioService,
	getPortfolioService,
	createPortfolioService
} from '../services/portfolio';

export default class PortfolioController {
	static async createPortfolio(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const { schoolName, schoolLocation, graduationYear, degree, major } =
			req.body;

		const { event, data } = await createPortfolioService(
			userId,
			schoolName,
			schoolLocation,
			graduationYear,
			degree,
			major
		);

		switch (event) {
			case 'SUCCESS_CREATE_PORTFOLIO':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_CREATE_PORTFOLIO_PORTFOLIO_EXISTS':
				return sendResponse(
					res,
					httpStatus.BAD_REQUEST,
					'Portfolio already exists.'
				);
			case 'ERROR_CREATE_PORTFOLIO_UPDATE_USER_PORTFOLIO_ID':
				return sendResponse(
					res,
					httpStatus.BAD_REQUEST,
					'Unable to sync user portfolio.'
				);
			case 'ERROR_CREATE_PORTFOLIO_PORTFOLIO_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'Portfolio not found.');
			case 'ERROR_CREATE_PORTFOLIO':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Could not create portfolio.'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error.'
				);
		}
	}

	static async changePortfolio(req: RequestExtended, res: Response) {
		const { userId } = req.user;
		const {
			schoolName,
			schoolLocation,
			graduationYear,
			degree,
			major,
			clubs,
			sports
		} = req.body;

		const { event, data } = await changePortfolioService(
			userId,
			schoolName,
			schoolLocation,
			graduationYear,
			degree,
			major,
			clubs,
			sports
		);

		switch (event) {
			case 'SUCCESS_CHANGE_PORTFOLIO':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_CHANGE_PORTFOLIO_PORTFOLIO_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'Portfolio not found.');
			case 'ERROR_CHANGE_PORTFOLIO_USER_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'User not found.');
			case 'ERROR_CHANGE_PORTFOLIO':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error.'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error.'
				);
		}
	}

	static async getPortfolio(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getPortfolioService(userId);

		switch (event) {
			case 'SUCCESS_GET_PORTFOLIO':
				return sendResponse(res, httpStatus.OK, 'Success', data);
			case 'ERROR_GET_PORTFOLIO_USER_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'User not found.');
			case 'ERROR_GET_PORTFOLIO':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Internal server error.'
				);
			default:
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Unexpected server error.'
				);
		}
	}
}
