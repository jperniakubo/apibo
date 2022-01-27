import {Request, Response, NextFunction} from 'express';

import {BuildingService} from '../../services/v1/building.service';
import {IComplements, IBuilding} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class BuildingController {
  private complementResponse = new ComplementResponse();
  private buildingService = new BuildingService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  listBuildings = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.listBuildings = request.body;
    const content = await this.buildingService.listBuildings(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  setBuildingStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.setBuildingStatusLog = request.body;
    const content = await this.buildingService.setBuildingStatus(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  createBuilding = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.CreateBuildingLog = request.body;

    const content = await this.buildingService.createBuilding(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateBuilding = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.UpdateBuildingLog = request.body;
    const content = await this.buildingService.updateBuilding(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  buildingById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IBuilding.BuildingById = request.body;
    const content = await this.buildingService.buildingById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
