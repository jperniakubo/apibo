import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {NotificationReservationController} from '../../app/controllers/v1/notificationReservation.controller';

// Call Controllers
const router = Router();
const notificationReservationController = new NotificationReservationController();
// Set Routers
router.post(
  '/listNotificationReservation',
  accessTokenMiddleware,
  notificationReservationController.listNotificationReservation
);

export default router;
