import { Request } from 'express';
import { Query, ParamsDictionary } from 'express-serve-static-core';

export interface TypedRequest<T extends Query, P extends ParamsDictionary, U>
	extends Request {
	body: U;
	query: T;
	params: P;
	user: {
		userId: string;
	};
	file: any;
	files: any[];
}
