import httpStatus from 'http-status';
import { errors } from '../lib/errors';
import { sendResponse } from '../util/response';
import { Response, NextFunction } from 'express';
import { RequestExtended } from '../types/request';

export default function errorHandler(
	err: Error,
	req: RequestExtended,
	res: Response,
	next: NextFunction
) {
	if (res.headersSent) return next(err);

	switch (err.name) {
		case errors.fileUpload.MulterError:
			return sendResponse(
				res,
				httpStatus.BAD_REQUEST,
				'An error occurred while uploading.'
			);
		case errors.fileUpload.INVALID_FILE_TYPE:
			return sendResponse(res, httpStatus.CONFLICT, 'Invalid file type.');
	}
}
