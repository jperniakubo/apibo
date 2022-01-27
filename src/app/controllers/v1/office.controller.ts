import {Request, Response, NextFunction} from 'express';

import {OfficeService} from '../../services/v1/office.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';
import {OfficeItems} from '../../models/OfficeItems';
import {OfficeImages} from '../../models/OfficeImages';

export class OfficeController {
  private complementResponse = new ComplementResponse();
  private officeService = new OfficeService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  getListOfOfficeByFloor = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const filterOffice: IComplements.FilterOfficeByFloor = request.body;
    const content = await this.officeService.getListOfOfficeByFloor(
      filterOffice
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getOfficeInfo = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const officeId: IComplements.ID = request.body;
    const content = await this.officeService.getOfficeInfo(officeId);
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
    const content = await this.officeService.getAllFilter(dataTemp);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  getListOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataTemp: any = request.body;
    const content = await this.officeService.getListOffice(dataTemp);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  getAllOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const officeId: IComplements.ID = request.body;
    const content = await this.officeService.getAllOffice();
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  changeStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: any = request.params;
    const content = await this.officeService.changeStatus(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  createOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    let data: any = request.body;
    data = {
      ...data,
      photo: request.files,
      officeItems: JSON.parse(request.body.officeItems)
    };
    const content = await this.officeService.createOffice(data);
    await this.complementResponse.returnData(response, nextOrError, content, {
      upload: true,
      router: 'office',
      files: request.files,
      recursive: ['officeImages']
    });
  };

  getFavoritesOfficesOfUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UsersFavoritesOffices = request.body;
    const content = await this.officeService.getFavoritesOfficesOfUser(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  addOfficeToFavorites = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.AddOfficeToFavorites = request.body;
    const content = await this.officeService.addOfficeToFavorites(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  reservationOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ReservationOffice = request.body;
    const content = await this.officeService.reservationOffice(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  listUserReservations = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataTemp: any = request.body;
    const content = await this.officeService.listUserReservations(dataTemp);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getReservationInfo = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content: any = await this.officeService.getReservationInfo(data);
    //console.log(content.data);
    //console.log(content.data.dataValues.userInfo);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  verifyQrCode = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.qrCode = request.body;
    const content: any = await this.officeService.verifyQrCode(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  cancelReservation = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.ID = request.body;
    const content = await this.officeService.cancelReservation(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateReservation = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.UpdateReservation = request.body;
    const content = await this.officeService.updateReservation(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  checkQrOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.CheckQrOffice = request.body;
    const content = await this.officeService.checkQrOffice(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  allPage = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.officeService.allPage(
      parseInt(data.limit),
      parseInt(data.offset)
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  officeArrivalsDirection = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: any = request.params;
    const content = await this.officeService.officeArrivalsDirection(
      parseInt(data.officeId),
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
    const content = await this.officeService.all(
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
    const content = await this.officeService.index(id);
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
    const content = await this.officeService.filter(name);
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
    const content = await this.officeService.remove(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  create = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const data: IComplements.CrudLog = request.body;

    const content = await this.officeService.create(data, request.files);
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
    const data: IComplements.CrudLog = request.body;
    const content = await this.officeService.update(id, data, request.files);
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
    const content = await this.officeService.updateStatus(id, data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  updateArrivalsStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.officeService.updateArrivalsStatus(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
  updateItemStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const id: IComplements.ID = {id: parseInt(request.params.id)};
    const content = await this.officeService.updateItemStatus(id);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
