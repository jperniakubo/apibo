import {Request, Response, NextFunction} from 'express';

import {CityService} from '../../services/v1/city.service';
import {IComplements, ICity} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class CityController {
  private complementResponse = new ComplementResponse();
  private cityService = new CityService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  all = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const pagination: IComplements.Pagination = request.body;
    const content = await this.cityService.all(pagination);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  listCities = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.listCities = request.body;
    const content = await this.cityService.listCities(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  setCityStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: ICity.setCityStatusLog = request.body;
    const content = await this.cityService.setCityStatus(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  createCity = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: ICity.CreateCityLog = request.body;

    const content = await this.cityService.createCity(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateCity = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: ICity.UpdateCityLog = request.body;
    const content = await this.cityService.updateCity(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  cityById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: ICity.CityById = request.body;
    const content = await this.cityService.cityById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
