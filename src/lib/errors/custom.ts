export interface CustomErrorArgs {
	name: string;
	message: string;
	trace?: any;
}

export default class CustomError extends Error {
	name: string;
	message: string;
	trace?: any;

	constructor({ name, message, trace }: CustomErrorArgs) {
		super();
		this.name = name;
		this.message = message;
		this.trace = trace;
	}
}
