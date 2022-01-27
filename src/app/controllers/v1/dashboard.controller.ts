import {Request, Response, NextFunction} from 'express';

import {DashboardService} from '../../services/v1/dashboard.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class DashboardController {
  private complementResponse = new ComplementResponse();
  private DashboardService = new DashboardService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {

  getAllMoreReserved = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllMoreReserved(
      dataTemp.dateInit,
      dataTemp.dateEnd,
      dataTemp.cityId
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getOfficesPercent = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getOfficesPercent(
      dataTemp.dateInit,
      dataTemp.dateEnd,
      dataTemp.cityId
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  officesMoreReserved = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.officesMoreReserved(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllLessReserved = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllLessReserved(
      dataTemp.dateInit,
      dataTemp.dateEnd,
      dataTemp.cityId
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllReservationsByStatus = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllReservationsByStatus(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllReservationsByCity = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllReservationsByCity(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllReservationsByUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllReservationsByUser(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllReservationsCancelByUser = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllReservationsCancelByUser(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getAllReservationsByOffice = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    // eslint-disable-next-line radix
    const dataTemp: any = request.body;
    const content = await this.DashboardService.getAllReservationsByOffice(
      dataTemp.dateInit,
      dataTemp.dateEnd
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  totalReservations = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataTemp: any = request.body;
    const content = await this.DashboardService.totalReservations(
      dataTemp.timeFrame
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  reservationsByCity = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataTemp: any = request.body;
    const content = await this.DashboardService.reservationsByCity(
      dataTemp.timeFrame
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  reservationsByOfficeType = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const dataTemp: any = request.body;
    const content = await this.DashboardService.reservationsByOfficeType(
      dataTemp.timeFrame
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
