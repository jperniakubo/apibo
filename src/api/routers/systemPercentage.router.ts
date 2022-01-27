import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {SystemPercentageController} from '../../app/controllers';

// Call Controllers
const router = Router();
const systemPercentageController = new SystemPercentageController();
// Set Routers

router.post(
  '/getAllPercentages',
  accessTokenMiddleware,
  systemPercentageController.getAllPercentages
);

export default router;
