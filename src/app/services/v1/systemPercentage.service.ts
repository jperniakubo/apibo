import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {SystemPercentageRepository} from '../../repository/v1/systemPercentage.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class SystemPercentageService {
  systemPercentageRepository: SystemPercentageRepository = new SystemPercentageRepository();

  getAllPercentages = async () => {
    const data = await this.systemPercentageRepository.getAllPercentages();
    // Check if Exist
    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };
}
