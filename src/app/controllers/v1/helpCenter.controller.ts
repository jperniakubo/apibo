import {Request, Response, NextFunction} from 'express';

import {HelpCenterService} from '../../services/v1/helpCenter.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class HelpCenterController {
  private complementResponse = new ComplementResponse();
  private HelpCenterService = new HelpCenterService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  allPage = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.HelpCenterService.allPage(
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
    const content = await this.HelpCenterService.all(
      parseInt(data.limit),
      parseInt(data.offset)
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
    const content = await this.HelpCenterService.index(id);
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
    const content = await this.HelpCenterService.filter(name);
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
    const content = await this.HelpCenterService.getAllFilter(dataTemp);
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
    const content = await this.HelpCenterService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.CRUD = request.body;
    const content = await this.HelpCenterService.create(data);
    await this.complementResponse.returnData(response, nextOrError, content);
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
    const content = await this.HelpCenterService.update(id, data);
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
    const content = await this.HelpCenterService.updateStatus(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
