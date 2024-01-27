import { Router } from 'express';
import UserController from '../../../controllers/user';
import upload from '../../../middleware/uploader/upload';
import { validate } from '../../../middleware/validation/validate';

import {
	deleteAccountValidator,
	followerFollowingValidator,
	updateDataValidator
} from '../../../middleware/validation/rules';

const userRouter = Router();

userRouter.get('/@me', UserController.getUser);

userRouter.put(
	'/update-data',
	updateDataValidator,
	validate,
	UserController.changeData
);

userRouter.put('/update-notification-id', UserController.saveNotificationId);
userRouter.get('/get-notifications', UserController.getNotifications);

userRouter.post(
	'/update-avatar',
	upload(['image/jpeg', 'image/png', 'image/jpg'], 10).single('image'),
	UserController.updateAvatar
);

userRouter.get('/remove-avatar', UserController.removeAvatar);

userRouter.get(
	'/follow-counts',
	followerFollowingValidator,
	UserController.getFollowCounts
);

userRouter.delete(
	'/delete',
	deleteAccountValidator,
	UserController.deleteAccount
);

export default userRouter;
