import config from '../../../config';
import {IComplements, IUser} from '../../../resources/interfaces';
import {UsersRepository} from '../../repository/v1/users.repository';
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
import {Users} from '../../models/Users';
const Path = require('path');
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class UserService {
  private usersRepository: UsersRepository = new UsersRepository();
  private reservationOfficeRepository: ReservationOfficeRepository = new ReservationOfficeRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  changeUserState = async (request: IUser.UserStateLog) => {
    if (!(await this.usersRepository.existsUserOnDB(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del administrador es incorrecto'
      );

    const updateState = await this.usersRepository.changeUserState(
      request.active,
      request.uid
    );

    const action = `Ha modificado el usuario ${request.uid} a estado ${
      request.active == 1 ? 'activo' : 'inactivo'
    }`;
    await this.logActionsRepository.saveLogAction(
      action,
      'users',
      request.uid,
      request.logBoAdminId
    );

    return generalServiceResponse(updateState);
  };

  getUserInfoById = async (request: IUser.ID) => {
    const user = await this.usersRepository.getUserInfoById(request.id);
    console.log('user', user);
    const countActive = await this.reservationOfficeRepository.countReservationsByUser(
      request.id,
      'active'
    );
    const countInactive = await this.reservationOfficeRepository.countReservationsByUser(
      request.id,
      'inactive'
    );
    const countUsed = await this.reservationOfficeRepository.countReservationsByUser(
      request.id,
      'used'
    );
    return generalServiceResponse(
      {user, countActive, countInactive, countUsed},
      'Operación exitosa'
    );
  };
  updateTypePostion = async (request: any) => {
    console.log('reques', request);
    if (request.typePositionsId > 3) {
      request.typePositionsId = null;
    }
    await Users.update(
      {
        typePositionsId: request.typePositionsId
      },
      {where: {uid: request.uid}}
    );
    return generalServiceResponse({code: 100}, 'Operación exitosa');
  };
}
