import { Router } from 'express';
import PortfolioController from '../../../controllers/portfolio';
import { validate } from '../../../middleware/validation/validate';

import { changePortfolioValidator } from '../../../middleware/validation/rules';

const portfolioRouter = Router();

portfolioRouter.get('/', PortfolioController.getPortfolio);

portfolioRouter.put(
	'/update',
	changePortfolioValidator,
	validate,
	PortfolioController.changePortfolio
);

export default portfolioRouter;
