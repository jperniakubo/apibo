import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {ReservationOfficeController} from '../../app/controllers';

// Call Controllers
const router = Router();
const reservationOfficeController = new ReservationOfficeController();
// Set Routers
router.get(
  '/page/:limit/:offset',
  accessTokenMiddleware,
  reservationOfficeController.allPage
);
router.get('/', accessTokenMiddleware, reservationOfficeController.all);

router.get('/:id', accessTokenMiddleware, reservationOfficeController.get);
router.post(
  '/all/filter',
  accessTokenMiddleware,
  reservationOfficeController.getAllFilter
);
router.post(
  '/getAllByDateAndOffice',
  accessTokenMiddleware,
  reservationOfficeController.getAllByDateAndOffice
);
router.get(
  '/filter/:name',
  accessTokenMiddleware,
  reservationOfficeController.filter
);
router.post('/', accessTokenMiddleware, reservationOfficeController.create);
router.put('/:id', accessTokenMiddleware, reservationOfficeController.update);
router.put(
  '/status/:id',
  accessTokenMiddleware,
  reservationOfficeController.updateStatus
);
router.delete('/:id', accessTokenMiddleware, reservationOfficeController.del);

export default router;
