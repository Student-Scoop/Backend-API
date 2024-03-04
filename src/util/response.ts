import { Response } from 'express';

export interface ResponsePayload {
	code: number;
	status: boolean;
	message?: string;
	data?: object;
}
export interface ServiceToController {
	event: string;
	data: object;
}

export function serviceToController(
	event: string,
	data: object = {}
): ServiceToController {
	return { event: event, data: data };
}

export class CreateResponse {
	res: Response;
	statusCode: number;
	message: string;
	data: object;

	constructor(res: Response) {
		this.res = res;
	}

	code(statusCode: number) {
		this.statusCode = statusCode;
		return this;
	}

	msg(message: string) {
		this.message = message;
		return this;
	}

	payload(data: object) {
		this.data = data;
		return this;
	}

	send() {
		let status = this.statusCode >= 200 && this.statusCode < 300;
		let buildResponsePayload: ResponsePayload = {
			status: status,
			code: this.statusCode
		};

		if (status) {
			buildResponsePayload.data = this.data;
		} else {
			this.message ? (buildResponsePayload.message = this.message) : null;
		}

		this.res.status(this.statusCode).json(buildResponsePayload);
	}
}
