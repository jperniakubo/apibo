import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {SystemTimeAvailableRepository} from '../../repository/v1/systemTimeAvailable.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class SystemTimeAvailableService {
  systemTimeAvailableRepository: SystemTimeAvailableRepository = new SystemTimeAvailableRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  updateTimeAvailable = async (request: IComplements.CRUDUpdateTime) => {
    const resultUpdate: any = await this.systemTimeAvailableRepository.updateTimeAvailable(
      request.id,
      request.time
    );
    if (resultUpdate.success) {
      const action = `Ha modificado el tiempo mínimo para hacer una reserva a ${request.time} minutos`;
      await this.logActionsRepository.saveLogAction(
        action,
        'systemTimeAvailable',
        request.id.toString(),
        request.logBoAdminId
      );

      return generalServiceResponse(resultUpdate, 'Operación exitosa');
    }

    return generalServiceResponse(null, resultUpdate.message);
  };

  getTimeById = async (request: IComplements.ID) => {
    const data = await this.systemTimeAvailableRepository.getTimeById(
      request.id
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
