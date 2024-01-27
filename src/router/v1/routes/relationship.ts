import { Router } from 'express';
import { validate } from '../../../middleware/validation/validate';
import RelationshipController from '../../../controllers/relationship';

import {
	followerFollowingValidator,
	followValidator,
	searchValidator
} from '../../../middleware/validation/rules';

const relationshipRouter = Router();

relationshipRouter.post(
	'/follow',
	followValidator,
	validate,
	RelationshipController.follow
);

relationshipRouter.post('/unfollow', RelationshipController.unfollow);

relationshipRouter.get(
	'/followers',
	followerFollowingValidator,
	validate,
	RelationshipController.getFollowers
);

relationshipRouter.get(
	'/following',
	followerFollowingValidator,
	validate,
	RelationshipController.getFollowing
);

relationshipRouter.get('/random', RelationshipController.randomFollowers);

relationshipRouter.get(
	'/search',
	searchValidator,
	validate,
	RelationshipController.searchUser
);

export default relationshipRouter;
