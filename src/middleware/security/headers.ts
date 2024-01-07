export function secureHeaders(req, res, next) {
	res.header(
		'Strict-Transport-Security',
		'max-age=31536000; includeSubDomains'
	);

	res.header('Content-Security-Policy', "default-src 'self';");
	res.header('X-Frame-Options', 'SAMEORIGIN');
	res.header('X-XSS-Protection', '1; mode=block');
	res.header('Referrer-Policy', 'no-referrer');
	res.header('Origin-Agent-Cluster', '?1');

	next();
}
