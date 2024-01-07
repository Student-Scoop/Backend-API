import httpStatus from 'http-status';
import config from '../../config/env';
import { parseToken } from '../../lib/token';
import { Response, NextFunction } from 'express';
import { sendResponse } from '../../util/response';
import { RequestExtended } from '../../types/request';

export default async function auth(
	req: RequestExtended,
	res: Response,
	next: NextFunction
) {
	const rawAuthToken = req.headers.authorization;
	const authParts = rawAuthToken?.split(' ');

	if (rawAuthToken === '')
		return sendResponse(res, httpStatus.UNAUTHORIZED, 'Unauthorized');

	if (!authParts || authParts.length !== 2)
		return sendResponse(res, httpStatus.UNAUTHORIZED, 'Unauthorized');

	if (authParts[0] !== 'Bearer')
		return sendResponse(res, httpStatus.UNAUTHORIZED, 'Unauthorized');

	try {
		const authToken = parseToken(authParts[1], config.SECRET_KEY);

		req.user = {
			userId: authToken.UUID
		};

		next();
	} catch (err: any) {
		return sendResponse(res, httpStatus.UNAUTHORIZED, err.message);
	}
}
