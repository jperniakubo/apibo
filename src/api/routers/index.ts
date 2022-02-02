// Library Base
import router, {Request, Response, NextFunction} from 'express';

import config from '../../config';

import ConfigRouter from './config.router';
import OnboardingRouter from './onboarding.router';
import CatRouter from './client/cat.router';
import BoAdminRouter from './boAdmin.router';
import OfficeRouter from './office.router';
import ReservationOfficeRouter from './reservationOffice.router';
import OfficeTypeRouter from './officeType.router';
import HelpCenterRouter from './helpCenter.router';
import SystemOfficeItemsRouter from './systemOfficeItems.router';
import DashboardRouter from './dashboard.router';
import FloorBuildingRouter from './floorBuilding.router';
import CityRouter from './city.router';
import BuildingRouter from './building.router';
import UserRouter from './user.router';
import notificationReservationRouter from './notificationReservation.router';
import PositionRouter from './position.router';
import SystemTimeAvailableRouter from './systemTimeAvailable.router';
import SystemPercentageRouter from './systemPercentage.router';
import SystemItemIconRouter from './systemItemIcon.router';

const apiRouter = router();

// // Routes - Complements
apiRouter.use(`/${config.SHORT_NAME.toLowerCase()}`, ConfigRouter);
apiRouter.use('/onboarding', OnboardingRouter);
apiRouter.use('/cat', CatRouter);
apiRouter.use('/boAdmin', BoAdminRouter);
apiRouter.use('/office', OfficeRouter);
apiRouter.use('/reservationOffice', ReservationOfficeRouter);
apiRouter.use('/officeType', OfficeTypeRouter);
apiRouter.use('/helpCenter', HelpCenterRouter);
apiRouter.use('/systemOfficeItems', SystemOfficeItemsRouter);
apiRouter.use('/dashboard', DashboardRouter);
apiRouter.use('/floorBuilding', FloorBuildingRouter);
apiRouter.use('/city', CityRouter);
apiRouter.use('/building', BuildingRouter);
apiRouter.use('/user', UserRouter);
apiRouter.use('/notificationReservation', notificationReservationRouter);
apiRouter.use('/position', PositionRouter);
apiRouter.use('/systemTimeAvailable', SystemTimeAvailableRouter);
apiRouter.use('/systemPercentage', SystemPercentageRouter);
apiRouter.use('/systemItemIcon', SystemItemIconRouter);

// Exception
apiRouter.all(
  '*',
  (request: Request, response: Response, errorHandler: NextFunction) => {
    errorHandler(new Error('Page not found'));
  }
);

export default apiRouter;
