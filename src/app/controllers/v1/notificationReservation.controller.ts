import {Request, Response, NextFunction} from 'express';

import {NotificationReservationService} from '../../services/v1/notificationReservation.service';
import {IComplements} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';

export class NotificationReservationController {
  private complementResponse = new ComplementResponse();
  private notificationReservationService = new NotificationReservationService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {
  listNotificationReservation = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IComplements.Pagination = request.body;
    const content = await this.notificationReservationService.listNotificationReservation(
      data
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
