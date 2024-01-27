import { body, param, query } from 'express-validator';

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

export const followValidator = [
	body('followId').isString().isMongoId().withMessage('Not valid Id')
];

export const searchValidator = [
	query('query').exists().isString().withMessage('query cannot be empty')
];

export const notifIdValidator = [
	query('notificationId').exists().withMessage('Not valid Id')
];

export const updateDataValidator = [
	body('password').optional().isString().withMessage('invalid password'),
	body(['username', 'newPassword', 'name']).custom((value, { req }) => {
		if (req.body.username && !req.body.name && !req.body.newPassword) {
			return true;
		} else if (!req.body.username && req.body.name && !req.body.newPassword) {
			return true;
		} else if (!req.body.username && !req.body.name && req.body.newPassword) {
			return true;
		}

		throw new Error('Either username, newPassword, or name is required.');
	})
];

export const createPortfolioValidator = [
	body('schoolName').exists().isString().withMessage('invalid school name'),
	body('schoolLocation')
		.exists()
		.isString()
		.withMessage('invalid school location'),
	body('graduationYear')
		.exists()
		.isString()
		.withMessage('invalid graduation year'),
	body('degree').exists().isString().withMessage('invalid degree'),
	body('major').exists().isString().withMessage('invalid major')
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

export const deleteAccountValidator = [
	body('password').exists().isString().withMessage('invalid password')
];
