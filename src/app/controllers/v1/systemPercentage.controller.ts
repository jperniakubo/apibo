import {Request, Response, NextFunction} from 'express';

import {SystemPercentageService} from '../../services/v1/systemPercentage.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class SystemPercentageController {
  private complementResponse = new ComplementResponse();
  private systemPercentageService = new SystemPercentageService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getAllPercentages = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const content = await this.systemPercentageService.getAllPercentages();
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
