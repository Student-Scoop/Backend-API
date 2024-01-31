import { body, query } from 'express-validator';

export const followerFollowingValidator = [
	query('take').optional().isNumeric().withMessage('produce posts to take'),
	query('skip').optional().isNumeric().withMessage('produce skip to take')
];

export const registerValidation = [
	body('name')
		.exists()
		.withMessage('Name field is required.')
		.isString()
		.withMessage('Name field must be a string.')
		.isLength({ max: 100, min: 2 })
		.withMessage('Name must be between 2 and 15 characters long.'),
	body('username')
		.custom((value) => {
			if (value.includes(' ')) {
				throw new Error('Spaces are not allowed in the input.');
			}
			return true;
		})
		.exists()
		.withMessage('username field is required.')
		.isString()
		.withMessage('username field must be a string.')
		.isLength({ max: 24, min: 1 })
		.withMessage('username must be between 2 and 15 characters long.'),
	body('email')
		.exists()
		.withMessage('Email field is required.')
		.isEmail()
		.withMessage('Invalid email address.'),
	body('password')
		.exists()
		.withMessage('Password field is required.')
		.isStrongPassword()
		.withMessage(
			'Password must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and symbols.'
		)
];

export const removeAvatarValidation = [
	body('userId').exists().isString().withMessage('Invalid user ID.')
];

export const loginValidation = [
	body('username')
		.exists()
		.withMessage('User Name field is required.')
		.isString()
		.withMessage('Invalid user name'),
	body('password')
		.exists()
		.withMessage('Password field is required.')
		.isLength({ max: 15, min: 2 })
		.withMessage('Password must be between 2 and 15 characters long.')
];

export const loginWithGoogleValidation = [
	body('token')
		.notEmpty()
		.withMessage('No token is provided.')
		.exists()
		.withMessage('Token is required.')
		.isString()
		.withMessage('Invalid Google token.')
];

export const followValidator = [
	body('followId').isString().isMongoId().withMessage('Not valid Id')
];

export const searchValidator = [
	query('query').exists().isString().withMessage('query cannot be empty')
];

export const updateDataValidator = [
	body('password').optional().isString().withMessage('invalid password'),
	body(['username', 'newPassword', 'name']).custom((value, { req }) => {
		const { username, newPassword, name } = req.body;

		if (username || newPassword || name) return true;

		throw new Error('Either username, newPassword, or name is required.');
	})
];

const changePortfolioKeys = [
	'schoolName',
	'schoolLocation',
	'graduationYear',
	'degree',
	'major',
	'clubs',
	'sports'
];

export const changePortfolioValidator = [
	body(changePortfolioKeys).custom((value, { req }) => {
		const keys = Object.keys(req.body);
		const isValid = keys.some((key) => changePortfolioKeys.includes(key));

		if (!isValid) {
			throw new Error(
				`At least one of the following values is needed ${changePortfolioKeys.join(
					', '
				)}`
			);
		}

		return true;
	})
];
