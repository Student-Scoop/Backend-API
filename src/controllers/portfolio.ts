import { Response } from 'express';
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
				return res.status(200).json({ message: 'Success', data });
			case 'ERROR_CREATE_PORTFOLIO_PORTFOLIO_EXISTS':
				return res.status(400).json({ message: 'Portfolio already exists' });
			case 'ERROR_CREATE_PORTFOLIO_UPDATE_USER_PORTFOLIO_ID':
				return res.status(500).json({ message: 'Unable to sync portfolio' });
			case 'ERROR_CREATE_PORTFOLIO_PORTFOLIO_NOT_FOUND':
				return res.status(404).json({ message: 'Portfolio not found' });
			case 'ERROR_CREATE_PORTFOLIO':
				return res.status(500).json({ message: 'Internal server error' });
			default:
				return res.status(500).json({ message: 'Unexpected server error' });
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

		console.log(event, data);

		switch (event) {
			case 'SUCCESS_CHANGE_PORTFOLIO':
				return res.status(200).json({ message: 'Success', data });
			case 'ERROR_CHANGE_PORTFOLIO_PORTFOLIO_NOT_FOUND':
				return res.status(404).json({ message: 'Portfolio not found' });
			case 'ERROR_CHANGE_PORTFOLIO_USER_NOT_FOUND':
				return res.status(404).json({ message: 'User not found' });
			case 'ERROR_CHANGE_PORTFOLIO':
				return res.status(500).json({ message: 'Internal server error' });
			default:
				return res.status(500).json({ message: 'Unexpected server error' });
		}
	}

	static async getPortfolio(req: RequestExtended, res: Response) {
		const { userId } = req.user;

		const { event, data } = await getPortfolioService(userId);

		switch (event) {
			case 'SUCCESS_GET_PORTFOLIO':
				return res.status(200).json({ message: 'Success', data });
			case 'ERROR_GET_PORTFOLIO_USER_NOT_FOUND':
				return res.status(404).json({ message: 'User not found' });
			case 'ERROR_GET_PORTFOLIO':
				return res.status(500).json({ message: 'Internal server error' });
			default:
				return res.status(500).json({ message: 'Unexpected server error' });
		}
	}
}
