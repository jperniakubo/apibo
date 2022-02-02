import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {SystemTimeAvailableController} from '../../app/controllers';

// Call Controllers
const router = Router();
const systemTimeAvailableController = new SystemTimeAvailableController();
// Set Routers

router.post(
  '/updateTimeAvailable',
  accessTokenMiddleware,
  systemTimeAvailableController.updateTimeAvailable
);

router.post(
  '/getTimeById',
  accessTokenMiddleware,
  systemTimeAvailableController.getTimeById
);

export default router;
