import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {DashboardController} from '../../app/controllers';

// Call Controllers
const router = Router();
const dashboardController = new DashboardController();
// Set Routers

router.post(
  '/all/filter',
  accessTokenMiddleware,
  dashboardController.getAllReservationsByStatus
);

router.post(
  '/all/more',
  accessTokenMiddleware,
  dashboardController.getAllMoreReserved
);
router.post(
  '/getOfficesPercent',
  accessTokenMiddleware,
  dashboardController.getOfficesPercent
);
router.post(
  '/all/less',
  accessTokenMiddleware,
  dashboardController.getAllLessReserved
);
router.post(
  '/getTopOfficesMoreReserved',
  accessTokenMiddleware,
  dashboardController.officesMoreReserved
);
router.post(
  '/all/city',
  accessTokenMiddleware,
  dashboardController.getAllReservationsByCity
);
router.post(
  '/all/users',
  accessTokenMiddleware,
  dashboardController.getAllReservationsByUser
);
router.post(
  '/getUsersCancelReservations',
  accessTokenMiddleware,
  dashboardController.getAllReservationsCancelByUser
);
router.post(
  '/all/office',
  accessTokenMiddleware,
  dashboardController.getAllReservationsByOffice
);

router.post(
  '/totalReservations',
  accessTokenMiddleware,
  dashboardController.totalReservations
);
router.post(
  '/reservationsByCity',
  accessTokenMiddleware,
  dashboardController.reservationsByCity
);
router.post(
  '/reservationsByOfficeType',
  accessTokenMiddleware,
  dashboardController.reservationsByOfficeType
);

export default router;
