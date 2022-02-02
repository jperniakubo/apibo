import {timestampWithMs} from '@sentry/utils';

import sha1 from 'crypto-js/sha1';

import config from '../../../config';
import {OfficeRepository} from '../../repository/v1/office.repository';
import {OfficeImagesRepository} from '../../repository/v1/officeImages.repository';
import {OfficeItemsRepository} from '../../repository/v1/officeItems.repository';
import {OfficePlainsRepository} from '../../repository/v1/officePlains.repository';
import {OfficeArrivalsDirectionRepository} from '../../repository/v1/officeArrivalsDirection.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {UsersRepository} from '../../repository/v1/users.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class OfficeService {
  officeRepository: OfficeRepository = new OfficeRepository();
  officeImagesRepository: OfficeImagesRepository = new OfficeImagesRepository();
  officeItemsRepository: OfficeItemsRepository = new OfficeItemsRepository();
  officePlainsRepository: OfficePlainsRepository = new OfficePlainsRepository();
  userRepository: UsersRepository = new UsersRepository();
  officeArrivalsDirectionRepository: OfficeArrivalsDirectionRepository = new OfficeArrivalsDirectionRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  getListOfOfficeByFloor = async (
    request: IComplements.FilterOfficeByFloor
  ) => {
    const data = await this.officeRepository.getListOfOfficeByFloor(
      request.date,
      request.startTime,
      request.endTime,
      request.cityId,
      request.buildingId,
      request.officeTypeId,
      request.floorBuildingId,
      request.limit,
      request.offset,
      request.uid
    );
    return generalServiceResponse(data);
  };

  getOfficeInfo = async (request: IComplements.ID) => {
    const data = await this.officeRepository.getOfficeInfo(request.id);
    return generalServiceResponse(data);
  };

  getAllOffice = async () => {
    const data = await this.officeRepository.getAllOffice();
    return generalServiceResponse(data);
  };

  getAllFilter = async (request: any) => {
    const name: string = request.name;
    const officeTypeId: number = request.officeTypeId;
    const buildingId: number = request.buildingId;
    const cityId: number = request.cityId;
    const limit: number = request.limit;
    const offset: number = request.offset;

    const data = await this.officeRepository.getAllFilter(
      name,
      officeTypeId,
      buildingId,
      cityId,
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

  getListOffice = async (request: any) => {
    const name: string = request.name;
    const officeTypeId: number = request.officeTypeId;
    const buildingId: number = request.buildingId;
    const cityId: number = request.cityId;
    const limit: number = request.limit;
    const offset: number = request.offset;

    const data = await this.officeRepository.getListOffice(
      name,
      officeTypeId,
      buildingId,
      cityId,
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

  changeStatus = async (request: any) => {
    const getOffice = await this.officeRepository.getOneOfficeInfo(request.id);

    if (!getOffice || getOffice == undefined || getOffice == null) {
      return generalServiceResponse(
        null,
        'Ocurrió un error al cambiar el estado del espacio'
      );
    }

    if (getOffice.dataValues.status == 'active') {
      const data = await this.officeRepository.changeStatus(
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

    if (getOffice.dataValues.status == 'inactive') {
      const data = await this.officeRepository.changeStatus(
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
      'Se ha actualizado correctamente el estado'
    );
  };

  createOffice = async (request: any) => {
    // const getOffice = await this.officeRepository.createOffice(
    //   request.name,
    // );

    // if(!getOffice || getOffice == undefined || getOffice == null){

    //   return generalServiceResponse(
    //     null,
    //     'Ocurrió un error al cambiar el estado del espacio'
    //   );
    // }

    return generalServiceResponse(
      true,
      'Se ha actualizado correctamente el estado'
    );
  };

  getFavoritesOfficesOfUser = async (
    request: IComplements.UsersFavoritesOffices
  ) => {
    const data = await this.officeRepository.getFavoritesOfficesOfUser(
      request.uid,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  verifyQrCode = async (request: IComplements.qrCode) => {
    const data = await this.officeRepository.verifyQrCode(request.qrCode);
    return generalServiceResponse(data);
  };

  addOfficeToFavorites = async (request: IComplements.AddOfficeToFavorites) => {
    const user = await this.userRepository.findByUID(request.uid);
    if (user === null)
      return generalServiceResponse(
        null,
        'Idenficicador del usuario es incorrecto o este se encuentra inactivo'
      );

    // if (!(await this.officeRepository.existsOffice(request.officeId)))
    const existOffice = await this.officeRepository.getOfficeById(
      request.officeId
    );
    if (existOffice === null)
      return generalServiceResponse(
        null,
        'El identificador de la oficina es incorrecto'
      );

    const responseAddToFavorites = await this.officeRepository.addOfficeToFavorites(
      request.officeId,
      request.uid
    );
    return responseAddToFavorites.success
      ? generalServiceResponse({success: true}, responseAddToFavorites.message)
      : generalServiceResponse(null, 'Ha ocurrido un error inesperado');
  };

  reservationOffice = async (request: IComplements.ReservationOffice) => {
    if (!(await this.userRepository.existsUser(request.uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );

    if (!this.userRepository.existsUser(request.leadReservationUid))
      return generalServiceResponse(
        null,
        'Identificación del líder de la reservación es incorrecto'
      );

    const checkPreviousReservation = await this.officeRepository.isAvailableOffice(
      request.date,
      request.startTime,
      request.endTime,
      request.officeId
    );
    if (!checkPreviousReservation.available)
      return generalServiceResponse(
        {code: 401, ...checkPreviousReservation.data},
        'El horario indicado se encuentra reservado'
      );

    const data = await this.officeRepository.reservationOffice(
      request.date,
      request.startTime,
      request.endTime,
      request.uid,
      request.leadReservationUid,
      request.officeId
    );
    return generalServiceResponse(
      {code: 100, ...data.dataValues},
      'Reservación creada correctamente'
    );
  };

  listUserReservations = async (request: any) => {
    const uid: string = request.uid;
    const cityId: number = request.cityId;
    const buildingId: number = request.buildingId;
    const officeTypeId: number = request.officeTypeId;
    const status: string = request.status;
    const limit: number = request.limit;
    const offset: number = request.offset;
    const columnOrder: string = request.columnOrder;
    const sortBy: string = request.sortBy;

    if (!(await this.userRepository.existsUser(uid)))
      return generalServiceResponse(
        null,
        'Identificador del usuario es incorrecto'
      );

    const data = await this.officeRepository.listUserReservations(
      uid,
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

    // return generalServiceResponse(
    //   await this.officeRepository.listUserReservations(
    //     uid,
    //     cityId,
    //     buildingId,
    //     officeTypeId,
    //     status,
    //     limit,
    //     offset
    //   ),
    //   'Operación exitosa'
    // );
  };

  getReservationInfo = async (request: IComplements.ID) => {
    return generalServiceResponse(null, 'Servicio desactivado temporalmente');
    /* if (!(await this.officeRepository.exitsAndIsActiveReservation(request.id)))
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    const response = await this.officeRepository.getInfoAboutReservation(
      request.id
    );
    return generalServiceResponse(response, 'Operación exitosa');
    */
  };

  cancelReservation = async (request: IComplements.ID) => {
    if (!(await this.officeRepository.exitsAndIsActiveReservation(request.id)))
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    await this.officeRepository.cancelReservation(request.id);
    return generalServiceResponse(
      {success: true},
      'Su reservación ha sido cancelada'
    );
  };

  updateReservation = async (request: IComplements.UpdateReservation) => {
    if (
      !(await this.officeRepository.exitsAndIsActiveReservation(
        request.reservationId
      ))
    )
      return generalServiceResponse(
        null,
        'La reservación no existe ó se encuentra cancelada'
      );

    if (
      (await this.userRepository.findByUID(request.leadReservationUid)) === null
    )
      return generalServiceResponse(
        null,
        'El identificador del lider de la reservación es incorrecto, por favor verifique'
      );

    const existOffice = await this.officeRepository.getOfficeById(
      request.officeId
    );
    if (existOffice === null)
      return generalServiceResponse(
        null,
        'El identificador de la oficina es incorrecto'
      );

    if (
      !(
        await this.officeRepository.isAvailableOffice(
          request.date,
          request.startTime,
          request.endTime,
          request.officeId,
          request.reservationId
        )
      ).available
    )
      return generalServiceResponse(
        null,
        'Lo sentimos, no se encuentra disponible la configuración seleccionada'
      );
    return generalServiceResponse(
      this.officeRepository.updateReservation(
        request.reservationId,
        request.date,
        request.startTime,
        request.endTime,
        request.leadReservationUid,
        request.officeId
      ),
      'Reservación actualizada correctamente'
    );
  };

  checkQrOffice = async (request: IComplements.CheckQrOffice) => {
    const isValidCode = await this.officeRepository.checkQrOffice(
      request.officeId,
      request.code
    );
    // const isValidCode = true;
    return generalServiceResponse(
      {valid: isValidCode},
      'Verificación realizada'
    );
  };

  all = async (limit: number, offset: number) => {
    const data = await this.officeRepository.getAll(limit, offset);
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
    const data = await this.officeRepository.getAllPage(limit, offset);
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
  officeArrivalsDirection = async (
    officeId: number,
    limit: number,
    offset: number
  ) => {
    const data = await this.officeArrivalsDirectionRepository.findAllForOfficeId(
      officeId,
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
    const data = await this.officeRepository.getOne(id);
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
    const data = await this.officeRepository.filter(name);
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
    const data = await this.officeRepository.destroy({id});
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.DESTROY
    };
  };

  create = async (request: any, files: any) => {
    const data = await this.officeRepository.createOffice(request);
    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }

    let dataTmp = data.dataValues;

    const pepe = await this.officeRepository.getCreated(
      dataTmp.name,
      dataTmp.cityId,
      dataTmp.buildingId,
      dataTmp.officeTypeId,
      dataTmp.floorBuildingId,
      dataTmp.description
    );

    if (files != null) {
      const uniqueSuffix = `main-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;
      const slug = 'office/' + sha1(uniqueSuffix).toString();

      Object.assign(request, {slug});

      // eslint-disable-next-line no-param-reassign

      if (files.main != undefined) {
        const extension = files.main.name.split('.').pop();
        const imgMain = `${process.env.IMG_URL}${slug}/main.${extension}`;

        await this.officeImagesRepository.saveImages(
          imgMain,
          pepe.dataValues.id,
          dataTmp.description
        );
      }
      if (files['image[0]'] != undefined) {
        const extension = files['image[0]'].name.split('.').pop();
        const imgPlains = `${process.env.IMG_URL}${slug}/image.${extension}`;

        await this.officePlainsRepository.saveImagesPlains(
          imgPlains,
          pepe.dataValues.id,
          dataTmp.description
        );
      }
    }

    request.officeItems = JSON.parse(request.officeItems);

    request.officeItems.map(async (item: any) => {
      // console.log(item);
      await this.officeItemsRepository.saveItems(
        item.image.id,
        pepe.dataValues.id,
        item.name
      );
    });

    request.instructions = JSON.parse(request.instructions);

    request.instructions.map(async (item: any) => {
      // console.log(item);
      await this.officeArrivalsDirectionRepository.saveInstructions(
        item,
        pepe.dataValues.id
      );
    });

    const action = `Ha creado la oficina ${pepe.dataValues.id} con nombre: ${request.name}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'office',
      pepe.dataValues.id,
      request.logBoAdminId
    );

    return {
      status: true,
      data: request,
      message: lang.STACK.CRUD.MAKE
    };
  };

  update = async (key: any, request: any, files: any) => {
    const id: number = key.id;
    const data = await this.officeRepository.updateOfficeType(request, id);

    if (typeof data === 'undefined' || !data) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.MAKE
      };
    }

    if (files != null) {
      const uniqueSuffix = `main-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;
      const slug = 'office/' + sha1(uniqueSuffix).toString();

      Object.assign(request, {slug});

      // eslint-disable-next-line no-param-reassign

      if (files.main != undefined) {
        const extension = files.main.name.split('.').pop();
        const imgMain = `${process.env.IMG_URL}${slug}/main.${extension}`;

        await this.officeImagesRepository.updateImages(
          imgMain,
          id,
          request.description
        );
      }
      if (files['image[0]'] != undefined) {
        const extension = files['image[0]'].name.split('.').pop();
        const imgPlains = `${process.env.IMG_URL}${slug}/image.${extension}`;

        await this.officePlainsRepository.updateImagesPlains(
          imgPlains,
          id,
          request.description
        );
      }
    }

    request.officeItems = JSON.parse(request.officeItems);

    let items = await this.officeItemsRepository.all({
      where: {officeId: id, status: 'active'}
    });

    for (let i = 0; i < request.officeItems.length; i++) {
      if (i < items.length) {
        await this.officeItemsRepository.updateItems(
          request.officeItems[i].image.id,
          items[i].dataValues.id,
          request.officeItems[i].name
        );
      } else {
        await this.officeItemsRepository.saveItems(
          request.officeItems[i].image.id,
          id,
          request.officeItems[i].name
        );
      }
    }

    request.instructions = JSON.parse(request.instructions);

    let instruction = await this.officeArrivalsDirectionRepository.all({
      where: {officeId: id, status: 'active'}
    });

    for (let i = 0; i < request.instructions.length; i++) {
      if (i < instruction.length) {
        await this.officeArrivalsDirectionRepository.updateInstructions(
          request.instructions[i].title,
          instruction[i].dataValues.id
        );
      } else {
        await this.officeArrivalsDirectionRepository.saveInstructions(
          request.instructions[i].title,
          id
        );
      }
    }

    const action = `Ha modificado la oficina ${id} con nombre: ${request.name}`;
    await this.logActionsRepository.saveLogAction(
      action,
      'office',
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
    const getOfficeType = await this.officeRepository.getById(request.id);
    let action = '';

    if (!getOfficeType || getOfficeType == undefined || getOfficeType == null) {
      return generalServiceResponse(
        null,
        'No existe ningún tipo de oficina con este id'
      );
    }

    if (getOfficeType.dataValues.status == 'active') {
      const data = await this.officeRepository.updateStatus(
        request.id,
        'inactive'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
      action = `Ha modificado el espacio ${request.id} a estado inactivo`;
    }

    if (getOfficeType.dataValues.status == 'inactive') {
      const data = await this.officeRepository.updateStatus(
        request.id,
        'active'
      );
      if (data[0] === 0) {
        return generalServiceResponse(
          null,
          'Ocurrió un error al cambiar el estado del espacio'
        );
      }
      action = `Ha modificado el espacio ${request.id} a estado activo`;
    }

    await this.logActionsRepository.saveLogAction(
      action,
      'office',
      request.id,
      dataBody.logBoAdminId
    );

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };

  updateArrivalsStatus = async (request: any) => {
    // console.log(request);
    const getOfficeType = await this.officeArrivalsDirectionRepository.one({
      where: {id: request.id}
    });

    if (!getOfficeType || getOfficeType == undefined || getOfficeType == null) {
      return generalServiceResponse(null, 'No existe ningún elemento');
    }
    // console.log(getOfficeType);

    const data: any = await this.officeArrivalsDirectionRepository.changeStatusInstructions(
      request.id
    );

    // console.log(data);
    if (data[0] === 0) {
      return generalServiceResponse(
        null,
        'Ocurrió un error al cambiar el estado'
      );
    }

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };
  updateItemStatus = async (request: any) => {
    const getOfficeType = await this.officeItemsRepository.one({
      where: {id: request.id}
    });

    if (!getOfficeType || getOfficeType == undefined || getOfficeType == null) {
      return generalServiceResponse(null, 'No existe ningún elemento');
    }
    // console.log(getOfficeType);

    const data: any = await this.officeItemsRepository.updateItemStatus(
      request.id
    );

    // console.log(data);
    if (data[0] === 0) {
      return generalServiceResponse(
        null,
        'Ocurrió un error al cambiar el estado'
      );
    }

    return generalServiceResponse(
      true,
      'El estado se ha actualizado correctamente'
    );
  };
}
