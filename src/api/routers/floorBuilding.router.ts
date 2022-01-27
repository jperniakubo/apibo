import {Router} from 'express';

import {accessTokenMiddleware} from '../middlewares';
import {FloorBuildingController} from '../../app/controllers';

// Call Controllers
const router = Router();
const floorBuildingController = new FloorBuildingController();
// Set Routers
router.get(
  '/page/:limit/:offset',
  accessTokenMiddleware,
  floorBuildingController.allPage
);
router.get('/', accessTokenMiddleware, floorBuildingController.all);
router.get('/:id', accessTokenMiddleware, floorBuildingController.get);
router.get(
  '/filter/:name',
  accessTokenMiddleware,
  floorBuildingController.filter
);
router.post(
  '/all/filter',
  accessTokenMiddleware,
  floorBuildingController.getAllFilter
);
router.get(
  '/all/building/:buildingId',
  accessTokenMiddleware,
  floorBuildingController.getAllFloorByBuildingId
);
router.post('/', accessTokenMiddleware, floorBuildingController.create);
router.put('/:id', accessTokenMiddleware, floorBuildingController.update);
router.put(
  '/status/:id',
  accessTokenMiddleware,
  floorBuildingController.updateStatus
);
router.delete('/:id', accessTokenMiddleware, floorBuildingController.del);

export default router;
