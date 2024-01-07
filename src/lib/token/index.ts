import crypto from 'crypto';

const TokenVersion = '1';

export interface TokenPayload {
	UUID: string;
	Timestamp: string;
}

function getTimestamp(): string {
	return Math.floor(new Date().getTime() / 1000).toString();
}

function base64Encode(data: string): string {
	return Buffer.from(data).toString('base64url');
}

function base64Decode(data: string): string {
	return Buffer.from(data, 'base64').toString();
}

export function signHs256(data: any, secret: string) {
	return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export function verifyHs256(data: any, secret: string, signature: string) {
	return crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(signHs256(data, secret))
	);
}

export function generateToken(uuid: string, secret: string) {
	const tokenVersionEncdoed = base64Encode(TokenVersion);

	const payload: TokenPayload = {
		UUID: uuid,
		Timestamp: getTimestamp()
	};

	const payloadEncoded = base64Encode(JSON.stringify(payload));

	let tokenParts: string[] = [tokenVersionEncdoed, payloadEncoded];

	const signatureData = tokenParts.join('.');
	const signPart = signHs256(signatureData, secret);

	tokenParts.push(base64Encode(signPart));

	return tokenParts.join('.');
}

export function parseToken(token: string, secret: string): TokenPayload {
	const tokenParts = token.split('.');
	if (tokenParts.length !== 3) {
		throw new Error('invalid token format');
	}

	const signatureData = tokenParts.slice(0, 2).join('.');
	const decodedSignature = base64Decode(tokenParts[2]);

	if (!verifyHs256(signatureData, secret, decodedSignature))
		throw new Error('invalid token signature');

	const versionDecoded = base64Decode(tokenParts[0]);
	if (versionDecoded !== TokenVersion) throw new Error('invalid token format');

	const payloadDecoded = base64Decode(tokenParts[1]);
	const payload: TokenPayload = payloadDecoded
		? JSON.parse(payloadDecoded)
		: {};

	return payload;
}
