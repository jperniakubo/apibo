import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {PositionController} from '../../app/controllers';

// Call Controllers
const router = Router();
const positionController = new PositionController();
// Set Routers

router.post(
  '/getAllPositions',
  accessTokenMiddleware,
  positionController.getAllPositions
);

router.post(
  '/getPositions',
  accessTokenMiddleware,
  positionController.getPositions
);

router.post(
  '/createPosition',
  accessTokenMiddleware,
  positionController.createPosition
);

router.post(
  '/updatePosition',
  accessTokenMiddleware,
  positionController.updatePosition
);

router.post(
  '/getPositionById',
  accessTokenMiddleware,
  positionController.getPositionById
);

export default router;
