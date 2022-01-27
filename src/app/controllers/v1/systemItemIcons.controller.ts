import {Request, Response, NextFunction} from 'express';

import {SystemItemIconsService} from '../../services/v1/systemItemIcons.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class SystemItemIconsController {
  private complementResponse = new ComplementResponse();
  private systemItemIconsService = new SystemItemIconsService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getAllSystemIcons = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const content = await this.systemItemIconsService.getAllSystemIcons();
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
