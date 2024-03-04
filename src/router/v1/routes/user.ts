import { Router } from 'express';
import UserController from '../../../controllers/user';
import upload from '../../../middleware/uploader/upload';
import { validate } from '../../../middleware/validation/validate';

import {
	followerFollowingValidator,
	updateDataValidator
} from '../../../middleware/validation/rules';

const userRouter = Router();

userRouter.get('/:id', UserController.getUser);
userRouter.get('/:id/portfolio', UserController.getPortfolio);

userRouter.put(
	'/settings',
	updateDataValidator,
	validate,
	UserController.changeData
);

userRouter.post(
	'/avatar',
	upload(['image/jpeg', 'image/png', 'image/jpg'], 10).single('image'),
	UserController.updateAvatar
);

userRouter.get('/remove-avatar', UserController.removeAvatar);

userRouter.get(
	'/follow-counts',
	followerFollowingValidator,
	UserController.getFollowCounts
);

export default userRouter;
