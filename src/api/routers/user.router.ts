import {Router} from 'express';

import {UserController} from '../../app/controllers/v1/user.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const userController = new UserController();

router.post(
  '/changeUserState',
  accessTokenMiddleware,
  userController.changeUserState
);

router.post(
  '/getUserInfoById',
  accessTokenMiddleware,
  userController.getUserInfoById
);

router.put(
  '/updateTypePostion',
  accessTokenMiddleware,
  userController.updateTypePostion
);

export default router;
