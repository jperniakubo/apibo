import {Request, Response, NextFunction} from 'express';

import {PositionService} from '../../services/v1/positions.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class PositionController {
  private complementResponse = new ComplementResponse();
  private positionService = new PositionService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getAllPositions = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    // const dataTemp: any = request.body;
    const content = await this.positionService.getAllPositions();
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getPositions = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.paginationWithNeedle = request.body;
    const content = await this.positionService.getPositions(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  createPosition = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CrudLog = request.body;

    const content = await this.positionService.createPosition(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updatePosition = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CrudUpdateLog = request.body;
    const content = await this.positionService.updatePosition(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getPositionById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content = await this.positionService.getPositionById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
