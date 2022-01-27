import {Request, Response, NextFunction} from 'express';

import {SystemTimeAvailableService} from '../../services/v1/systemTimeAvailable.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class SystemTimeAvailableController {
  private complementResponse = new ComplementResponse();
  private systemTimeAvailableService = new SystemTimeAvailableService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  updateTimeAvailable = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CRUDUpdateTime = request.body;
    const content = await this.systemTimeAvailableService.updateTimeAvailable(
      data
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getTimeById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content = await this.systemTimeAvailableService.getTimeById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
