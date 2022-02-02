import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {HelpCenterController} from '../../app/controllers';

// Call Controllers
const router = Router();
const helpCenterController = new HelpCenterController();
// Set Routers
router.get(
  '/page/:limit/:offset',
  accessTokenMiddleware,
  helpCenterController.allPage
);
router.get('/', accessTokenMiddleware, helpCenterController.all);
router.get('/:id', accessTokenMiddleware, helpCenterController.get);
router.get('/filter/:name', accessTokenMiddleware, helpCenterController.filter);
router.post(
  '/all/filter',
  accessTokenMiddleware,
  helpCenterController.getAllFilter
);
router.post('/', accessTokenMiddleware, helpCenterController.create);
router.put('/:id', accessTokenMiddleware, helpCenterController.update);
router.put(
  '/status/:id',
  accessTokenMiddleware,
  helpCenterController.updateStatus
);
router.delete('/:id', accessTokenMiddleware, helpCenterController.del);

export default router;
