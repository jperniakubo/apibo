import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {NotificationReservationRepository} from '../../repository/v1/notificationReservation.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class NotificationReservationService {
  notificationReservationRepository: NotificationReservationRepository = new NotificationReservationRepository();

  listNotificationReservation = async (request: IComplements.Pagination) => {
    return generalServiceResponse(
      await this.notificationReservationRepository.listNotificationReservation(
        request.limit,
        request.offset
      ),
      'Operación exitosa'
    );
  };
}
