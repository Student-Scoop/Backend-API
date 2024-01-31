import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { sendResponse } from '../util/response';
import { RequestExtended } from '../types/request';
import {
	loginService,
	googleLoginService,
	signupService
} from '../services/auth';

export default class AuthController {
	static async login(req: Request, res: Response) {
		const { username, password } = req.body;

		const { event, data } = await loginService(username, password);

		switch (event) {
			case 'SUCCESS_LOGIN':
				return sendResponse(res, httpStatus.OK, 'Login successful.', data);
			case 'ERROR_LOGIN_INVALID_USERNAME':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid username.');
			case 'ERROR_LOGIN_INVALID_PASSWORD':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid password.');
			case 'ERROR_LOGIN':
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

	static async loginGoogle(req: RequestExtended, res: Response) {
		const { token } = req.body;

		const { event, data } = await googleLoginService(token);

		switch (event) {
			case 'SUCCESS_GOOGLE_LOGIN':
				return sendResponse(
					res,
					httpStatus.OK,
					'Google login successful.',
					data
				);
			case 'ERROR_GOOGLE_LOGIN_USER_NOT_FOUND':
				return sendResponse(
					res,
					httpStatus.BAD_REQUEST,
					'Google sign in not associated with any user.'
				);
			case 'ERROR_GOOGLE_LOGIN':
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

	static async signup(req: Request, res: Response) {
		const { name, email, password, username } = req.body;

		const { event, data } = await signupService(
			name,
			email,
			password,
			username
		);

		switch (event) {
			case 'SUCCESS_SIGNUP':
				return sendResponse(res, httpStatus.OK, 'Signup successful', data);
			case 'ERROR_SIGNUP_EMAIL_ALREADY_EXISTS':
				return sendResponse(res, httpStatus.SEE_OTHER, 'Email already exists.');
			case 'ERROR_SIGNUP_USER_NOT_CREATED':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'User not created.'
				);
			case 'ERROR_SIGNUP_PORTFOLIO_NOT_SYNCED':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'Portfolio not synced.'
				);
			case 'ERROR_SIGNUP':
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

	static async logout(req: Request, res: Response) {
		req.session.destroy(() =>
			sendResponse(res, httpStatus.NO_CONTENT, 'Logout successful')
		);
	}
}
