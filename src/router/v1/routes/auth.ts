import { Router } from 'express';
import AuthController from '../../../controllers/auth';
import { validate } from '../../../middleware/validation/validate';

import {
	loginValidation,
	registerValidation
} from '../../../middleware/validation/rules';

const authRouter = Router();

authRouter.post('/login', loginValidation, validate, AuthController.login);

authRouter.post(
	'/register',
	registerValidation,
	validate,
	AuthController.signup
);

authRouter.post('/logout', AuthController.logout);

export default authRouter;
