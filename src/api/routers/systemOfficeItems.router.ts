import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {SystemOfficeItemsController} from '../../app/controllers';

// Call Controllers
const router = Router();
const systemOfficeItemsController = new SystemOfficeItemsController();
// Set Routers
router.post(
  '/getAllSystemOfficeItems',
  accessTokenMiddleware,
  systemOfficeItemsController.getAllSystemOfficeItems
);

export default router;
