import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { validationResult, FieldValidationError } from 'express-validator';

export function validate(req: Request, res: Response, next: NextFunction) {
	let errorsFormatted = [];
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		errors.array().forEach((err: FieldValidationError) => {
			errorsFormatted.push({ field: err.path, message: err.msg });
		});
	}

	if (!errors.isEmpty()) {
		res.status(httpStatus.BAD_REQUEST).json({ errors: errorsFormatted });
	} else {
		next();
	}
}
