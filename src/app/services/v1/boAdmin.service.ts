import config from '../../../config';
import {IComplements} from '../../../resources/interfaces';
import {OnboardingAdminRepository} from '../../repository/v1/onboardingAdmin.repository';
import {LogPwdAdminRepository} from '../../repository/v1/logPwdAdmin.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {UsersRepository} from '../../repository/v1/users.repository';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
const Path = require('path');
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class BoAdminService {
  private onboardingRepository: OnboardingAdminRepository = new OnboardingAdminRepository();
  private usersRepository: UsersRepository = new UsersRepository();
  private logPwdAdminRepository: LogPwdAdminRepository = new LogPwdAdminRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  loginAdmin = async (request: IComplements.BoAdminLogin) => {
    if (!(await this.onboardingRepository.existsAdmin(request.email)))
      return generalServiceResponse({code: 402}, 'Usuario incorrecto');

    if (!(await this.onboardingRepository.isActiveAdmin(request.email)))
      return generalServiceResponse({code: 403}, 'Usuario inactivo');

    const resultLogin: any = await this.onboardingRepository.loginAdmin(
      request.email,
      request.password
    );
    if (resultLogin) {
      const getExchangeDate = await this.logPwdAdminRepository.getExchangeDate(
        resultLogin.dataValues.id
      );
      resultLogin.dataValues.exchangeDate = getExchangeDate;
    }
    //console.log(resultLogin);
    return resultLogin
      ? generalServiceResponse(
          {code: 200, ...resultLogin.dataValues},
          'Operación exitosa'
        )
      : generalServiceResponse({code: 405}, 'Acceso incorrecto');
  };

  listAdmins = async (request: IComplements.ListBoAdmins) => {
    const data = await this.onboardingRepository.listAdmins(
      request.limit,
      request.offset,
      request.needle
    );
    return generalServiceResponse(data);
  };

  searchAdmins = async (request: IComplements.SearchAdmins) => {
    const data = await this.onboardingRepository.searchAdmins(
      request.needle,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  createAdmin = async (
    request: IComplements.CreateAdminLog,
    filePicture: any
  ) => {
    if (await this.onboardingRepository.existsAdmin(request.email))
      return generalServiceResponse(
        {code: 401},
        'Ya existe un administrador con el mismo correo electrónico'
      );

    let profileImageName = '';
    // upload profile picture
    if (filePicture !== null) {
      let avatar: any = filePicture.avatar;
      profileImageName = avatar.name;
      avatar.name = Date.now() + Path.extname(avatar.name);
      avatar.mv('./uploads/boAdminImages/' + avatar.name);
    }

    const data = await this.onboardingRepository.createAdmin(
      request.fullName,
      request.position,
      request.email,
      request.password,
      profileImageName,
      request.roleAdminId,
      request.phoneNumber
    );
    const action = `Ha creado el administrador ${data.dataValues.id} con rol ${request.roleAdminId}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'boAdmin',
      data.dataValues.id,
      request.logBoAdminId
    );

    await this.logPwdAdminRepository.createNewLogPwdAdmin(data.dataValues.id);
    return generalServiceResponse(data, 'Operación exitosa');
  };

  changeAdminState = async (request: IComplements.AdminStateLog) => {
    if (!(await this.onboardingRepository.existsAdmin(request.id)))
      return generalServiceResponse(
        null,
        'El identificador del administrador es incorrecto'
      );

    const updateState = await this.onboardingRepository.changeAdminState(
      request.active,
      request.id
    );
    const action = `Ha modificado el administrador ${
      updateState.dataValues.id
    } a estado ${request.active == 1 ? 'activo' : 'inactivo'}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'boAdmin',
      updateState.dataValues.id,
      request.logBoAdminId
    );
    return generalServiceResponse(updateState);
  };

  updateAdmin = async (
    request: IComplements.UpdateAdminLog,
    filePicture: any
  ) => {
    let newFileName: string = '';
    if (
      !(
        filePicture === null ||
        !filePicture ||
        typeof filePicture === 'undefined'
      )
    ) {
      // upload profile picture
      let avatar: any = filePicture.avatar;
      avatar.name = Date.now() + Path.extname(avatar.name);
      avatar.mv('./uploads/boAdminImages/' + avatar.name);
      newFileName = avatar.name;
    }

    const resultUpdate: any = await this.onboardingRepository.updateAdmin(
      request.id,
      request.fullName,
      request.email,
      request.phoneNumber,
      request.position,
      request.oldPassword,
      request.newPassword,
      request.roleAdminId,
      newFileName
    );

    if (resultUpdate.success) {
      let action = '';
      if (request.newPassword !== '') {
        action = `Ha modificado el administrador con id ${request.id} (con contraseña) y rol ${request.roleAdminId}`;
      } else {
        action = `Ha modificado el administrador con id ${request.id} y rol ${request.roleAdminId}`;
      }
      await this.logActionsRepository.saveLogAction(
        action,
        'boAdmin',
        request.id.toString(),
        request.logBoAdminId
      );
      return generalServiceResponse(resultUpdate, 'Operación exitosa');
    }

    return generalServiceResponse(null, resultUpdate.message);
  };

  getAdminInfoById = async (request: IComplements.ID) => {
    const data = await this.onboardingRepository.getAdminInfoById(request.id);
    return generalServiceResponse(data, 'Operación exitosa');
  };

  getAllRolesAdmin = async () => {
    const data = await this.onboardingRepository.getAllRolesAdmin();
    return generalServiceResponse(data, 'Operación exitosa');
  };

  boListUsers = async (request: IComplements.BoListUsers) => {
    const data = await this.usersRepository.listUsers(
      request.needle,
      request.limit,
      request.offset,
      true
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  updateUserState = async (request: IComplements.UserState) => {
    //console.log('aqui voy');

    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del usuario es incorrecto'
      );

    const data = await this.usersRepository.updateUserState(
      request.uid,
      request.active
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };

  getBroadReportAboutUser = async (request: IComplements.UserUID) => {
    if (!(await this.usersRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'El identificador del usuario es incorrecto'
      );

    const data = await this.usersRepository.getBroadReportAboutUser(
      request.uid
    );
    return generalServiceResponse(data, 'Operación exitosa');
  };
}
