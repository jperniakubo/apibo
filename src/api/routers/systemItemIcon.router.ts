import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {SystemItemIconsController} from '../../app/controllers';

// Call Controllers
const router = Router();
const systemItemIconsController = new SystemItemIconsController();
// Set Routers

router.post(
  '/getAllSystemIcons',
  accessTokenMiddleware,
  systemItemIconsController.getAllSystemIcons
);

export default router;
