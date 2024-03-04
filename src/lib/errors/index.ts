import errors from './errors';
import CustomError from './custom';

export type Safe<T> =
	| {
			data: T;
			error: string | null;
	  }
	| {
			data: null;
			error: string | null;
	  };

export function safe<T>(
	promiseOrFunc: Promise<T> | (() => T)
): Promise<Safe<T>> | Safe<T> {
	if (promiseOrFunc instanceof Promise) return safeAsync(promiseOrFunc);

	return safeSync(promiseOrFunc);
}

async function safeAsync<T>(promise: Promise<T>): Promise<Safe<T>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (e) {
		if (e instanceof Error) return { data: null, error: e.message };

		return { data: null, error: 'Something went wrong' };
	}
}

function safeSync<T>(func: () => T): Safe<T> {
	try {
		const data = func();
		return { data, error: null };
	} catch (e) {
		if (e instanceof Error) return { data: null, error: e.message };

		return { data: null, error: 'Something went wrong' };
	}
}

export { errors, CustomError };
