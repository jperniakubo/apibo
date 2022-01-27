import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {FloorBuildingRepository} from '../../repository/v1/floorBuilding.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class FloorBuildingService {
  floorBuildingRepository: FloorBuildingRepository = new FloorBuildingRepository();

  all = async (limit: number, offset: number) => {
    const data = await this.floorBuildingRepository.getAll(limit, offset);
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
  getAllFloorByBuildingId = async (buildingId: number) => {
    const data = await this.floorBuildingRepository.getAllFloorByBuildingId(
      buildingId
    );
    // Check if Exist
    if (typeof data === 'undefined' || !data || data.length == 0) {
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
    const data = await this.floorBuildingRepository.getAllPage(limit, offset);
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
    const data = await this.floorBuildingRepository.getOne(id);
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

  filter = async (request: any) => {
    const name: string = request.name;
    const data = await this.floorBuildingRepository.filter(name);
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

    const data = await this.floorBuildingRepository.getAllFilter(
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
    const data = await this.floorBuildingRepository.destroy({id});
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.DESTROY
    };
  };

  create = async (request: IComplements.CRUD, files: any) => {
    const data = await this.floorBuildingRepository.create(request);

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }

    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  update = async (key: IComplements.ID, request: any) => {
    const id: number = key.id;
    const data = await this.floorBuildingRepository.updateFloorBuilding(
      request,
      id
    );

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.UPDATE
    };
  };

  updateStatus = async (request: any) => {
    const getFloorBuilding = await this.floorBuildingRepository.getOne(
      request.id
    );

    if (
      !getFloorBuilding ||
      getFloorBuilding == undefined ||
      getFloorBuilding == null
    ) {
      return generalServiceResponse(
        null,
        'No existe ningún tipo de oficina con este id'
      );
    }

    if (getFloorBuilding.dataValues.status == 'active') {
      const data = await this.floorBuildingRepository.updateStatus(
        request.id,
        'inactive'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
    }

    if (getFloorBuilding.dataValues.status == 'inactive') {
      const data = await this.floorBuildingRepository.updateStatus(
        request.id,
        'active'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
    }

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };
}
