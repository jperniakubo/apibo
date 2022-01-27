import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {OfficeTypeRepository} from '../../repository/v1/officeType.repository';
import {PositionsPerOfficeTypeRepository} from '../../repository/v1/positionsPerOfficeType';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
import {ConstantsManager} from '../../constants/constantsManager';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class OfficeTypeService {
  officeTypeRepository: OfficeTypeRepository = new OfficeTypeRepository();
  positionsPerOfficeTypeRepository: PositionsPerOfficeTypeRepository = new PositionsPerOfficeTypeRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  all = async (limit: number, offset: number) => {
    const data = await this.officeTypeRepository.getAll(limit, offset);
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

  allPage = async (limit: number, offset: number) => {
    const data = await this.officeTypeRepository.getAllPage(limit, offset);
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

  index = async (request: IComplements.ID) => {
    const id: number = request.id;
    const data = await this.officeTypeRepository.getOne(id);

    // Check if Exist
    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }

    const positions = await this.positionsPerOfficeTypeRepository.getPositionsByOfficeTypeId(
      data.dataValues.id
    );
    var arrayPositions = [];

    for (const position of positions) {
      arrayPositions.push(position.dataValues.positionId);
    }
    data.dataValues.positions = arrayPositions;

    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  filter = async (request: any) => {
    const name: string = request.name;
    const data = await this.officeTypeRepository.filter(name);
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
  getAllFilter = async (request: any) => {
    const name: string = request.name;
    const limit: number = request.limit;
    const offset: number = request.offset;

    const data = await this.officeTypeRepository.getAllFilter(
      name,
      limit,
      offset
    );
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

  remove = async (request: IComplements.ID) => {
    const id: number = request.id;
    const data = await this.officeTypeRepository.destroy({id});
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.DESTROY
    };
  };

  create = async (request: any, files: any) => {
    const uniqueSuffix = `main-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;

    // eslint-disable-next-line no-param-reassign
    if (files != null) {
      const extension = files.main.name.split('.').pop();
      const constantsManager = new ConstantsManager();
      const urlApiBo = String(constantsManager.getBaseUrl());
      const slug = 'officetype/' + sha1(uniqueSuffix).toString();

      const imgs = `${urlApiBo}${slug}/main.${extension}`;
      Object.assign(request, {slug});
      Object.assign(request, {image: imgs});
    }

    const data = await this.officeTypeRepository.create(request);
    const officeTypeData = await this.officeTypeRepository.one({
      where: {
        name: data.dataValues.name,
        description: data.dataValues.description
      }
    });

    request.positions = JSON.parse(request.positions);
    for (const position of request.positions) {
      this.positionsPerOfficeTypeRepository.savePositionPerOfficeType(
        officeTypeData.dataValues.id,
        position
      );
    }

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }

    const action = `Ha creado el tipo de oficina ${officeTypeData.dataValues.id} con nombre: ${request.name}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'officeType',
      officeTypeData.dataValues.id,
      request.logBoAdminId
    );

    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  update = async (key: IComplements.ID, request: any, files: any) => {
    const uniqueSuffix = `main-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;

    // eslint-disable-next-line no-param-reassign
    if (files != null) {
      const extension = files.main.name.split('.').pop();
      const constantsManager = new ConstantsManager();
      const urlApiBo = String(constantsManager.getBaseUrl());
      const slug = 'officetype/' + sha1(uniqueSuffix).toString();

      const imgs = `${urlApiBo}${slug}/main.${extension}`;
      Object.assign(request, {slug});
      Object.assign(request, {image: imgs});
    }

    const id: number = key.id;
    const data = await this.officeTypeRepository.updateOfficeType(request, id);

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }

    const positions = await this.positionsPerOfficeTypeRepository.getPositionsByOfficeTypeId(
      id
    );

    for (const position of positions) {
      await this.positionsPerOfficeTypeRepository.setPositionPerOfficeStatus(
        'inactive',
        position.dataValues.id
      );
    }
    request.positions = JSON.parse(request.positions);
    for (const position of request.positions) {
      const exist = await this.positionsPerOfficeTypeRepository.existPositionsByOfficeTypeId(
        id,
        position
      );
      if (exist) {
        const dataPositionPerOffType = await this.positionsPerOfficeTypeRepository.getByOfficeTypeAndPosition(
          id,
          position
        );
        await this.positionsPerOfficeTypeRepository.setPositionPerOfficeStatus(
          'active',
          dataPositionPerOffType.dataValues.id
        );
      } else {
        this.positionsPerOfficeTypeRepository.savePositionPerOfficeType(
          id,
          position
        );
      }
    }

    const action = `Ha modificado el tipo de oficina ${id} con nombre: ${request.name}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'officeType',
      id.toString(),
      request.logBoAdminId
    );

    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.UPDATE
    };
  };

  updateStatus = async (request: any, dataBody: any) => {
    const getOfficeType = await this.officeTypeRepository.getOne(request.id);
    let action = '';

    if (!getOfficeType || getOfficeType == undefined || getOfficeType == null) {
      return generalServiceResponse(
        null,
        'No existe ningún tipo de oficina con este id'
      );
    }

    if (getOfficeType.dataValues.status == 'active') {
      const data = await this.officeTypeRepository.updateStatus(
        request.id,
        'inactive'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
      action = `Ha modificado el tipo de oficina ${request.id} a estado inactivo`;
    }

    if (getOfficeType.dataValues.status == 'inactive') {
      const data = await this.officeTypeRepository.updateStatus(
        request.id,
        'active'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
      action = `Ha modificado el tipo de oficina ${request.id} a estado activo`;
    }

    await this.logActionsRepository.saveLogAction(
      action,
      'officeType',
      request.id,
      dataBody.logBoAdminId
    );

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };
}
