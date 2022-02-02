import {Request, Response, NextFunction} from 'express';

import {OfficeTypeService} from '../../services/v1/officeType.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class OfficeTypeController {
  private complementResponse = new ComplementResponse();
  private OfficeTypeService = new OfficeTypeService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  allPage = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.OfficeTypeService.allPage(
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
    const content = await this.OfficeTypeService.all(
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
    const content = await this.OfficeTypeService.index(id);
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
    const content = await this.OfficeTypeService.filter(name);
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
    const content = await this.OfficeTypeService.getAllFilter(dataTemp);
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
    const content = await this.OfficeTypeService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.body;
    const content = await this.OfficeTypeService.create(data, request.files);
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
    const data: any = request.body;
    const content = await this.OfficeTypeService.update(
      id,
      data,
      request.files
    );
    await this.complementResponse.returnData(response, nextOrError, content, {
      upload: true,
      files: request.files
    });
  };

  updateStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const data: IComplements.LOG = request.body;
    const content = await this.OfficeTypeService.updateStatus(id, data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
