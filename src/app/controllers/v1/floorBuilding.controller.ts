import {Request, Response, NextFunction} from 'express';

import {FloorBuildingService} from '../../services/v1/floorBuilding.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';
import {parse} from 'yamljs';

export class FloorBuildingController {
  private complementResponse = new ComplementResponse();
  private FloorBuildingService = new FloorBuildingService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  allPage = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.FloorBuildingService.allPage(
      parseInt(data.limit),
      parseInt(data.offset)
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  all = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.FloorBuildingService.all(
      parseInt(data.limit),
      parseInt(data.offset)
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  getAllFloorByBuildingId = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.FloorBuildingService.getAllFloorByBuildingId(
      parseInt(data.buildingId)
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  get = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.FloorBuildingService.index(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  filter = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const name: any = request.params;
    const content = await this.FloorBuildingService.filter(name);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllFilter = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.FloorBuildingService.getAllFilter(dataTemp);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  del = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.FloorBuildingService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.CRUD = request.body;
    const content = await this.FloorBuildingService.create(data, request.files);
    await this.complementResponse.returnData(response, nextOrError, content, {
      upload: true,
      files: request.files
    });
  };

  update = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const data: IComplements.CRUD = request.body;
    const content = await this.FloorBuildingService.update(id, data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.FloorBuildingService.updateStatus(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
