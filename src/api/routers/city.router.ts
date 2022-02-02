import {Router} from 'express';

import {CityController} from '../../app/controllers/v1/city.controller';
import {accessTokenMiddleware} from '../middlewares';

// Call Controllers
const router = Router();
const cityController = new CityController();

// Set Routers
router.post('/', accessTokenMiddleware, cityController.all);

router.post('/listCities', accessTokenMiddleware, cityController.listCities);

router.post(
  '/setCityStatus',
  accessTokenMiddleware,
  cityController.setCityStatus
);

router.post('/createCity', accessTokenMiddleware, cityController.createCity);

router.post('/updateCity', accessTokenMiddleware, cityController.updateCity);

router.post('/cityById', accessTokenMiddleware, cityController.cityById);

export default router;
