import { Router } from 'express';
import UserController from '../../../controllers/user';
import upload from '../../../middleware/uploader/upload';

import {
	deleteAccountValidator,
	followerFollowingValidator,
	updateDataValidator
} from '../../../middleware/validation/rules';

const userRouter = Router();

userRouter.get('/@me', UserController.getUser);
userRouter.put('/update-data', updateDataValidator, UserController.changeData);
userRouter.put('/update-notification-id', UserController.saveNotificationId);
userRouter.get('/get-notifications', UserController.getNotifications);

userRouter.post(
	'/update-avatar',
	upload(['image/jpeg', 'image/png'], 8).single('image'),
	UserController.updateAvatar
);

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
