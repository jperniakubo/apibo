import {Request, Response, NextFunction} from 'express';

import {ReservationOfficeService} from '../../services/v1/reservationOffice.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class ReservationOfficeController {
  private complementResponse = new ComplementResponse();
  private reservationOfficeService = new ReservationOfficeService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  allPage = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.reservationOfficeService.allPage(
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
    const content = await this.reservationOfficeService.all(
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
    const content = await this.reservationOfficeService.index(id);
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
    const content = await this.reservationOfficeService.filter(name);
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
    const content = await this.reservationOfficeService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.CRUD = request.body;
    const content = await this.reservationOfficeService.create(data);
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
    const content = await this.reservationOfficeService.update(id, data);
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
    const content = await this.reservationOfficeService.getAllFilter(dataTemp);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllByDateAndOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.reservationOfficeService.getAllByDateAndOffice(
      dataTemp
    );
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
    const content = await this.reservationOfficeService.updateStatus(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
