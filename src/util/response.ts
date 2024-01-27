import { Response } from 'express';

export interface ServiceToController {
	event: string;
	data: object;
}

export function sendResponse(
	res: Response,
	statusCode: number,
	message: string,
	data: object = {}
) {
	let status = statusCode >= 200 && statusCode < 300;

	res
		.status(statusCode)
		.json({ code: statusCode, status: status, message, data });
}

export function serviceToController(
	event: string,
	data: object = {}
): ServiceToController {
	return { event: event, data: data };
}
