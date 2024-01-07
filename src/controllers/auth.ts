import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { sendResponse } from '../util/response';
import { loginService, signupService } from '../services/auth';

export default class AuthController {
	static async login(req: Request, res: Response) {
		const { username, password } = req.body;

		const { event, data } = await loginService(username, password);

		switch (event) {
			case 'SUCCESS_LOGIN':
				return sendResponse(res, httpStatus.OK, 'Login successful', data);
			case 'ERROR_LOGIN_INVALID_USERNAME':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid username');
			case 'ERROR_LOGIN_INVALID_PASSWORD':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid password');
			case 'ERROR_LOGIN':
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
				return sendResponse(res, httpStatus.OK, 'Register successful', data);
			case 'ERROR_SIGNUP_EMAIL_ALREADY_EXISTS':
				return sendResponse(
					res,
					httpStatus.BAD_REQUEST,
					'Email already exists'
				);
			case 'ERROR_SIGNUP_USER_NOT_CREATED':
				return sendResponse(
					res,
					httpStatus.INTERNAL_SERVER_ERROR,
					'User not created'
				);
			case 'ERROR_SIGNUP':
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

	static async logout(req: Request, res: Response) {
		req.session.destroy(() =>
			sendResponse(res, httpStatus.NO_CONTENT, 'Logout successful')
		);
	}
}
