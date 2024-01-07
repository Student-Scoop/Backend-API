import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

/* Base Route */
router.get('/', (req, res) => res.sendStatus(200));

/* API Versioning */
router.use('/v1', v1Routes);

export default router;
