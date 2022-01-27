import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class ReservationOfficeService {
  reservationOfficeRepository: ReservationOfficeRepository = new ReservationOfficeRepository();

  all = async (limit: number, offset: number) => {
    const data = await this.reservationOfficeRepository.getAll(limit, offset);
    // Check if Exist
    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }

    data.map((resp: any) => {
      resp.dataValues.time = `${resp.dataValues.startTime}-${resp.dataValues.endTime}`;
    });
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  allPage = async (limit: number, offset: number) => {
    const data = await this.reservationOfficeRepository.getAllPage(
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

  index = async (request: IComplements.ID) => {
    const id: number = request.id;
    const data = await this.reservationOfficeRepository.getOne(id);
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
    const fullName: string = request.fullName;
    const cityId: number = request.cityId;
    const buildingId: number = request.buildingId;
    const officeTypeId: number = request.officeTypeId;
    const status: string = request.status;
    const limit: number = request.limit;
    const offset: number = request.offset;
    const columnOrder: string = request.columnOrder;
    const sortBy: string = request.sortBy;

    // await this.reservationOfficeRepository.verifyReservationExpired();
    const data = await this.reservationOfficeRepository.getAllFilter(
      fullName,
      cityId,
      buildingId,
      officeTypeId,
      status,
      limit,
      offset,
      columnOrder,
      sortBy
    );
    // Check if Exist
    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }

    data.reservations.map((resp: any) => {
      resp.dataValues.time = `${resp.dataValues.startTime}-${resp.dataValues.endTime}`;
    });
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  getAllByDateAndOffice = async (request: any) => {
    const officeName: string = request.officeName;
    const date: string = request.date;
    const limit: number = request.limit;
    const offset: number = request.offset;

    const data = await this.reservationOfficeRepository.getAllByDateAndOffice(
      officeName,
      date,
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
    data.reservations.forEach((resp: any) => {
      resp.dataValues.time = `${resp.dataValues.startTime}-${resp.dataValues.endTime}`;
    });
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  filter = async (request: any) => {
    const name: string = request.name;
    const data = await this.reservationOfficeRepository.filter(name);
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
    const data = await this.reservationOfficeRepository.destroy({id});
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.DESTROY
    };
  };

  create = async (request: IComplements.CRUD) => {
    const data = await this.reservationOfficeRepository.createOffice(request);
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
    const data = await this.reservationOfficeRepository.updateReservationOffice(
      request,
      id
    );

    if (data[0] === 0) {
      return generalServiceResponse(
        null,
        'Ocurrió un error al actualizar la información'
      );
    }
    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.UPDATE
    };
  };

  updateStatus = async (request: any) => {
    const getReservationOffice = await this.reservationOfficeRepository.getOne(
      request.id
    );

    if (
      !getReservationOffice ||
      getReservationOffice == undefined ||
      getReservationOffice == null
    ) {
      return generalServiceResponse(
        null,
        'No existe ningún tipo de oficina con este id'
      );
    }

    if (getReservationOffice.dataValues.status == 'active') {
      const data = await this.reservationOfficeRepository.updateStatus(
        request.id,
        'inactive'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado'
        );
      }
    }

    if (getReservationOffice.dataValues.status == 'inactive') {
      const data = await this.reservationOfficeRepository.updateStatus(
        request.id,
        'active'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado'
        );
      }
    }

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };
}
