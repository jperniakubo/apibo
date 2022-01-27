import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {OfficeController} from '../../app/controllers/v1/office.controller';

// Call Controllers
const router = Router();
const officeController = new OfficeController();
// Set Routers
router.get(
  '/page/:limit/:offset',
  accessTokenMiddleware,
  officeController.allPage
);
router.get(
  '/officeArrivalsDirection/:officeId/:limit/:offset',
  accessTokenMiddleware,
  officeController.officeArrivalsDirection
);
router.get('/', accessTokenMiddleware, officeController.all);
router.get('/:id', accessTokenMiddleware, officeController.get);
router.get('/filter/:name', accessTokenMiddleware, officeController.filter);
router.post(
  '/all/filter',
  accessTokenMiddleware,
  officeController.getAllFilter
);
router.post(
  '/getListOffice',
  accessTokenMiddleware,
  officeController.getListOffice
);
router.post('/', accessTokenMiddleware, officeController.create);
router.put('/:id', accessTokenMiddleware, officeController.update);
router.put('/status/:id', accessTokenMiddleware, officeController.updateStatus);
router.put(
  '/status/arrival/:id',
  accessTokenMiddleware,
  officeController.updateArrivalsStatus
);
router.put(
  '/status/item/:id',
  accessTokenMiddleware,
  officeController.updateItemStatus
);
router.delete('/:id', accessTokenMiddleware, officeController.del);

router.get(
  '/getAllOffice',
  accessTokenMiddleware,
  officeController.getAllOffice
);
router.put(
  '/changeStatus/:id',
  accessTokenMiddleware,
  officeController.changeStatus
);

router.post(
  '/createOffice',
  accessTokenMiddleware,
  officeController.createOffice
);
router.post(
  '/getListOfOfficeByFloor',
  accessTokenMiddleware,
  officeController.getListOfOfficeByFloor
);
router.post(
  '/getOfficeInfo',
  accessTokenMiddleware,
  officeController.getOfficeInfo
);
router.post(
  '/getFavoritesOfficesOfUser',
  accessTokenMiddleware,
  officeController.getFavoritesOfficesOfUser
);

router.post(
  '/addOfficeToFavorites',
  accessTokenMiddleware,
  officeController.addOfficeToFavorites
);

router.post(
  '/reservationOffice',
  accessTokenMiddleware,
  officeController.reservationOffice
);

router.post(
  '/listUserReservations',
  accessTokenMiddleware,
  officeController.listUserReservations
);

router.post(
  '/getReservationInfo',
  accessTokenMiddleware,
  officeController.getReservationInfo
);

router.post(
  '/verifyQrCode',
  accessTokenMiddleware,
  officeController.verifyQrCode
);

router.post(
  '/cancelReservation',
  accessTokenMiddleware,
  officeController.cancelReservation
);

router.post(
  '/updateReservation',
  accessTokenMiddleware,
  officeController.updateReservation
);

router.post(
  '/checkQrOffice',
  accessTokenMiddleware,
  officeController.checkQrOffice
);

export default router;
