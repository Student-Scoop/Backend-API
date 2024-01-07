//import { upload } from '../../../config/multer';
import { Request, Response, Router } from 'express';
import UserController from '../../../controllers/user';

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
