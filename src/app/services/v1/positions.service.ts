import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {PositionsRepository} from '../../repository/v1/positions.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class PositionService {
  positionsRepository: PositionsRepository = new PositionsRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  getAllPositions = async () => {
    const data = await this.positionsRepository.getAllPositions();
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

  getPositions = async (request: IComplements.paginationWithNeedle) => {
    const data = await this.positionsRepository.getPositions(
      request.needle,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  createPosition = async (request: IComplements.CrudLog) => {
    if (await this.positionsRepository.existsPosition(request.name)) {
      return generalServiceResponse(
        {code: 401},
        'Ya existe un cargo con el mismo nombre'
      );
    }

    const data = await this.positionsRepository.createPosition(request.name);

    if (data) {
      const action = `Ha creado el cargo ${data.dataValues.id} con el nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'positions',
        data.dataValues.id,
        request.logBoAdminId
      );
    }
    return generalServiceResponse(data, 'Operación exitosa');
  };

  updatePosition = async (request: IComplements.CrudUpdateLog) => {
    const resultUpdate: any = await this.positionsRepository.updatePosition(
      request.id,
      request.name
    );
    if (resultUpdate.success) {
      const action = `Ha modificado el cargo ${request.id} con el nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'positions',
        request.id.toString(),
        request.logBoAdminId
      );

      return generalServiceResponse(resultUpdate, 'Operación exitosa');
    }

    return generalServiceResponse(null, resultUpdate.message);
  };

  // changePositionState = async (request: IComplements.UserState) => {
  //   if (!(await this.usersRepository.existsUserOnDB(request.uid)))
  //     return generalServiceResponse(
  //       null,
  //       'El identificador del administrador es incorrecto'
  //     );

  //   const updateState = await this.positionsRepository.changePositionState(
  //     request.active,
  //     request.id
  //   );
  //   return generalServiceResponse(updateState);
  // };

  getPositionById = async (request: IComplements.ID) => {
    const data = await this.positionsRepository.getPositionById(request.id);
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
