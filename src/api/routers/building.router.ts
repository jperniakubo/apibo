import {Router} from 'express';

import {BuildingController} from '../../app/controllers/v1/building.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const buildingController = new BuildingController();
// Set Routers
router.post(
  '/listBuildings',
  accessTokenMiddleware,
  buildingController.listBuildings
);

router.post(
  '/setBuildingStatus',
  accessTokenMiddleware,
  buildingController.setBuildingStatus
);

router.post(
  '/createBuilding',
  accessTokenMiddleware,
  buildingController.createBuilding
);

router.post(
  '/updateBuilding',
  accessTokenMiddleware,
  buildingController.updateBuilding
);

router.post(
  '/buildingById',
  accessTokenMiddleware,
  buildingController.buildingById
);

export default router;
