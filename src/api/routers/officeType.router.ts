import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {OfficeTypeController} from '../../app/controllers';

// Call Controllers
const router = Router();
const officeTypeController = new OfficeTypeController();
// Set Routers
router.get(
  '/page/:limit/:offset',
  accessTokenMiddleware,
  officeTypeController.allPage
);
router.get('/', accessTokenMiddleware, officeTypeController.all);
router.get('/:id', accessTokenMiddleware, officeTypeController.get);
router.get('/filter/:name', accessTokenMiddleware, officeTypeController.filter);
router.post(
  '/all/filter',
  accessTokenMiddleware,
  officeTypeController.getAllFilter
);
router.post('/', accessTokenMiddleware, officeTypeController.create);
router.put('/:id', accessTokenMiddleware, officeTypeController.update);
router.put(
  '/status/:id',
  accessTokenMiddleware,
  officeTypeController.updateStatus
);
router.delete('/:id', accessTokenMiddleware, officeTypeController.del);

export default router;
