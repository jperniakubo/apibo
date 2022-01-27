import {Request, Response, NextFunction} from 'express';

import {SystemOfficeItemsService} from '../../services/v1/systemOfficeItems.service';
import {ComplementResponse} from '../generic';

export class SystemOfficeItemsController {
  private complementResponse = new ComplementResponse();
  private systemOfficeItemsService = new SystemOfficeItemsService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getAllSystemOfficeItems = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    // const dataTemp: any = request.body;
    const content = await this.systemOfficeItemsService.getAllSystemOfficeItems();
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
