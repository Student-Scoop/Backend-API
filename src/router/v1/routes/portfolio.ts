import { Router } from 'express';
import PortfolioController from '../../../controllers/portfolio';
import { validate } from '../../../middleware/validation/validate';

import {
	createPortfolioValidator,
	changePortfolioValidator
} from '../../../middleware/validation/rules';

const portfolioRouter = Router();

portfolioRouter.get('/', PortfolioController.getPortfolio);

portfolioRouter.post(
	'/create',
	createPortfolioValidator,
	validate,
	PortfolioController.createPortfolio
);

portfolioRouter.put(
	'/update',
	changePortfolioValidator,
	validate,
	PortfolioController.changePortfolio
);

export default portfolioRouter;
