import sha1 from 'crypto-js/sha1';
import {timestampWithMs} from '@sentry/utils';

import config from '../../../config';
import {BuildingRepository} from '../../repository/v1/building.repository';
import {OfficeRepository} from '../../repository/v1/office.repository';
import {OfficeImagesRepository} from '../../repository/v1/officeImages.repository';
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';
import {UsersRepository} from '../../repository/v1/users.repository';
import {IComplements} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
import {Op, Sequelize, where} from 'sequelize';
import {Office} from '../../models/Office';
import {City} from '../../models/City';
import {Building} from '../../models/Building';
import {OfficeType} from '../../models/OfficeType';
import {OfficeImages} from '../../models/OfficeImages';
import {FloorBuilding} from '../../models/FloorBuilding';
import {Users} from '../../models/Users';
import {any} from 'sequelize/types/lib/operators';
import {ConstantsManager} from '../../constants/constantsManager';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);
const moment = require('moment');

export class DashboardService {
  buildingRepository: BuildingRepository = new BuildingRepository();
  office: OfficeRepository = new OfficeRepository();
  officeImagesRepository: OfficeImagesRepository = new OfficeImagesRepository();
  reservationOfficeRepository: ReservationOfficeRepository = new ReservationOfficeRepository();
  usersRepository: UsersRepository = new UsersRepository();

  getAllReservationsByOffice = async (dateInit: string, dateEnd: string) => {
    const data = await this.reservationOfficeRepository.all({
      where: {
        date: {[Op.between]: [dateInit, dateEnd]}
      },
      attributes: [
        'id',
        'date',
        [Sequelize.fn('count', Sequelize.col('officeId')), 'quantity']
      ],
      include: [{model: Office, attributes: ['id', 'name']}],
      group: ['date', 'officeId'],
      order: [['date', 'DESC']]
    });
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

  getAllReservationsByUser = async (dateInit: string, dateEnd: string) => {
    const users = await this.usersRepository.all({
      attributes: ['uid', 'fullName', 'profileImage']
    });
    var data = [];
    const constantsManager = new ConstantsManager();
    const urlApiApp = String(constantsManager.getBaseUrlApiApp());

    for (const user of users) {
      const userUid = user.dataValues.uid;
      if (user.dataValues.profileImage !== '') {
        user.dataValues.profileImage = `${urlApiApp}users/${user.dataValues.profileImage}`;
      }
      const reservationsUser = await this.reservationOfficeRepository.one({
        attributes: [[Sequelize.fn('count', Sequelize.col('id')), 'quantity']],
        where: {
          [Op.and]: [
            {
              date: {[Op.between]: [dateInit, dateEnd]},
              status: {[Op.or]: ['active', 'used']},
              [Op.or]: [{uid: userUid}, {leadReservationUid: userUid}]
            }
          ]
        }
      });
      user.dataValues.quantity = reservationsUser.dataValues.quantity;
      data.push(user.dataValues);
    }

    data.sort(function (a, b) {
      return b.quantity - a.quantity;
    });
    data = data.slice(0, 5);
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

  getAllReservationsCancelByUser = async (
    dateInit: string,
    dateEnd: string
  ) => {
    const users = await this.usersRepository.all({
      attributes: ['uid', 'fullName', 'profileImage']
    });
    var data = [];
    const constantsManager = new ConstantsManager();
    const urlApiApp = String(constantsManager.getBaseUrlApiApp());

    for (const user of users) {
      const userUid = user.dataValues.uid;
      if (user.dataValues.profileImage !== '') {
        user.dataValues.profileImage = `${urlApiApp}users/${user.dataValues.profileImage}`;
      }
      const reservationsUser = await this.reservationOfficeRepository.one({
        attributes: [[Sequelize.fn('count', Sequelize.col('id')), 'quantity']],
        where: {
          [Op.and]: [
            {
              date: {[Op.between]: [dateInit, dateEnd]},
              status: 'inactive',
              [Op.or]: [{uid: userUid}, {leadReservationUid: userUid}]
            }
          ]
        }
      });
      user.dataValues.quantity = reservationsUser.dataValues.quantity;
      data.push(user.dataValues);
    }

    data.sort(function (a, b) {
      return b.quantity - a.quantity;
    });
    data = data.slice(0, 5);
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

  getAllReservationsByStatus = async (dateInit: string, dateEnd: string) => {
    const data = await this.reservationOfficeRepository.all({
      where: {
        status: {[Op.in]: ['active', 'inactive']},
        date: {[Op.between]: [dateInit, dateEnd]}
      },
      attributes: [
        'id',
        'date',
        'status',
        [Sequelize.fn('count', Sequelize.col('status')), 'quantity']
      ],
      group: ['status', 'date'],
      order: [['date', 'ASC']]
    });
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

  getAllReservationsByCity = async (dateInit: string, dateEnd: string) => {
    let data = await City.sequelize!.query(`
    select office.id,  city.name, reservationOffice.date, count(reservationOffice.officeId) as countMain from reservationOffice
    left join office on office.id = reservationOffice.officeId
    left join city on city.id = office.cityId
    where reservationOffice.date BETWEEN '${dateInit}' AND '${dateEnd}'
    group by  office.cityId, reservationOffice.date
    order by reservationOffice.date asc;`);
    // Check if Exist
    if (typeof data[0] === 'undefined' || !data[0] || data[0].length == 0) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }
    return {
      status: true,
      data: data[0],
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  officesMoreReserved = async (dateInit: string, dateEnd: string) => {
    const data = await this.reservationOfficeRepository.all({
      where: {
        [Op.and]: [
          {date: {[Op.between]: [dateInit, dateEnd]}},
          {[Op.or]: [{status: 'active'}, {status: 'used'}]}
        ]
      },
      attributes: [
        'id',
        'officeId',
        [
          Sequelize.fn('count', Sequelize.col('ReservationOffice.officeId')),
          'quantity'
        ]
      ],
      include: [
        {
          model: Office,
          attributes: ['id', 'name'],
          include: [
            {model: City, attributes: ['id', 'name']},
            {model: Building, attributes: ['id', 'name']},
            {model: OfficeType, attributes: ['id', 'name']},
            {model: FloorBuilding, attributes: ['id', 'floor']}
          ]
        }
      ],
      group: ['ReservationOffice.officeId'],
      order: [
        [
          Sequelize.fn('count', Sequelize.col('ReservationOffice.officeId')),
          'DESC'
        ]
      ],
      limit: 3
    });
    // Check if Exist
    if (typeof data === 'undefined' || !data || data.length == 0) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }
    for (const object of data) {
      const officeIdentifier = object.dataValues.officeId;
      const dataOfficeImage = await this.officeImagesRepository.one({
        attributes: ['image'],
        where: {
          officeId: officeIdentifier
        }
      });
      object.dataValues.img = dataOfficeImage.dataValues.image;
    }
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  getAllMoreReserved = async (
    dateInit: string,
    dateEnd: string,
    cityId: number
  ) => {
    const data = await this.reservationOfficeRepository.all({
      where: {
        [Op.and]: [
          {date: {[Op.between]: [dateInit, dateEnd]}},
          {[Op.or]: [{status: 'active'}, {status: 'used'}]}
        ]
      },
      attributes: [
        'id',
        'officeId',
        [Sequelize.fn('count', Sequelize.col('officeId')), 'quantity']
      ],
      include: [{model: Office, attributes: ['id', 'name'], where: {cityId}}],
      group: ['officeId'],
      limit: 5,
      order: [[Sequelize.fn('count', Sequelize.col('officeId')), 'DESC']]
    });
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
  // obtener los porcentajes de ocupacion de edificios
  getOfficesPercent = async (
    dateInit: string,
    dateEnd: string,
    cityId: number
  ) => {
    moment.locale('es');

    const end = moment(dateInit);
    const init = moment(dateEnd);
    const difference = init.diff(end, 'days') + 1;

    const data = await this.reservationOfficeRepository.all({
      where: {
        [Op.and]: [
          {date: {[Op.between]: [dateInit, dateEnd]}},
          {[Op.or]: [{status: 'active'}, {status: 'used'}]}
        ]
      },
      attributes: [
        'id',
        'officeId',
        [Sequelize.fn('count', Sequelize.col('officeId')), 'quantity']
      ],
      include: [
        {
          model: Office,
          attributes: ['id', 'name'],
          where: {cityId},
          include: [
            {
              model: Building,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      // group: ['officeId'],
      group: [Sequelize.col('office->building.id')],
      limit: 5,
      order: [[Sequelize.fn('count', Sequelize.col('officeId')), 'DESC']]
    });
    // Check if Exist
    if (typeof data === 'undefined' || !data || data.length == 0) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }
    for (const dataObject of data) {
      const buildId =
        dataObject.dataValues.office.dataValues.building.dataValues.id;
      const totalOfficesBuilding = await this.office.one({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
        where: {buildingId: buildId}
      });
      const totalOffices = totalOfficesBuilding.dataValues.total;
      const totalElementsByDates = totalOffices * difference;
      const quantityReservation = dataObject.dataValues.quantity;
      const percent = (
        (quantityReservation * 100) /
        totalElementsByDates
      ).toFixed(2);
      dataObject.dataValues.percentage = percent;
    }
    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  getAllLessReserved = async (
    dateInit: string,
    dateEnd: string,
    cityId: number
  ) => {
    const data = await this.reservationOfficeRepository.all({
      where: {
        [Op.and]: [
          {date: {[Op.between]: [dateInit, dateEnd]}},
          {[Op.or]: [{status: 'active'}, {status: 'used'}]}
        ]
      },
      attributes: [
        'id',
        'officeId',
        [Sequelize.fn('count', Sequelize.col('officeId')), 'quantity']
      ],
      include: [{model: Office, attributes: ['id', 'name'], where: {cityId}}],
      group: 'officeId',
      limit: 5,
      order: [[Sequelize.fn('count', Sequelize.col('officeId')), 'ASC']]
    });
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

  totalReservations = async (timeFrame: string) => {
    moment.locale('es');
    const todayFullDate = new Date();
    const dateInit = new Date(await this.getDateInit(todayFullDate, timeFrame));
    const dates = await this.getDateArray(dateInit, timeFrame);

    var arrayDates = [];
    var arrayInactive = [];
    var arrayUsed = [];

    for (const dateObject of dates) {
      const countInactive = await this.reservationOfficeRepository.getCounReservationByDateAndStatus(
        dateObject,
        'inactive'
      );
      const countUsed = await this.reservationOfficeRepository.getCounReservationByDateAndStatus(
        dateObject,
        'used'
      );

      if (timeFrame === 'year') {
        arrayDates.push(moment(dateObject).format('MMM'));
      } else {
        arrayDates.push(moment(dateObject).format('MMM D'));
      }
      arrayInactive.push(countInactive);
      arrayUsed.push(countUsed);
    }

    const data = {dates: arrayDates, used: arrayUsed, inactive: arrayInactive};
    // Check if Exist
    // if (typeof data === 'undefined' || !data || data.length == 0) {
    if (arrayDates.length === 0) {
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

  reservationsByCity = async (timeFrame: string) => {
    moment.locale('es');
    const todayFullDate = new Date();
    const dateEnd = moment(todayFullDate).format('YYYY-MM-DD');
    const dateInit = await this.getDateInit(todayFullDate, timeFrame);
    const initDate = new Date(dateInit);
    const dates = await this.getDateArray(initDate, timeFrame);
    const cities = await this.reservationOfficeRepository.getReservationCities(
      dateInit,
      dateEnd
    );

    console.log('cities', cities);

    var arrayDates = [];
    var arrayCities = [];
    for (const cityObject of cities) {
      var element: any[] = [];
      arrayCities.push({
        id: cityObject.dataValues.office.dataValues.city.dataValues.id,
        name: cityObject.dataValues.office.dataValues.city.dataValues.name,
        data: element
      });
    }
    for (const dateObject of dates) {
      if (timeFrame === 'year') {
        arrayDates.push(moment(dateObject).format('MMM'));
      } else {
        arrayDates.push(moment(dateObject).format('MMM D'));
      }

      for (const city of arrayCities) {
        const count = await this.reservationOfficeRepository.getCountReservationByDateAndCity(
          dateObject,
          city.id
        );
        city.data.push(count);
      }
    }

    const data = {dates: arrayDates, cities: arrayCities};

    console.log('city', data);
    // Check if Exist
    if (cities.length === 0) {
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

  reservationsByOfficeType = async (timeFrame: string) => {
    moment.locale('es');
    const todayFullDate = new Date();
    const dateEnd = moment(todayFullDate).format('YYYY-MM-DD');
    const dateInit = await this.getDateInit(todayFullDate, timeFrame);
    const initDate = new Date(dateInit);
    const dates = await this.getDateArray(initDate, timeFrame);
    const officeTypes = await this.reservationOfficeRepository.getReservationOfficeType(
      dateInit,
      dateEnd
    );

    var arrayDates = [];
    var arrayOTypes = [];

    for (const oTypeObject of officeTypes) {
      var element: any[] = [];
      arrayOTypes.push({
        id: oTypeObject.dataValues.office.dataValues.officeType.dataValues.id,
        name:
          oTypeObject.dataValues.office.dataValues.officeType.dataValues.name,
        data: element
      });
    }
    for (const dateObject of dates) {
      if (timeFrame === 'year') {
        arrayDates.push(moment(dateObject).format('MMM'));
      } else {
        arrayDates.push(moment(dateObject).format('MMM D'));
      }

      for (const officeType of arrayOTypes) {
        const count = await this.reservationOfficeRepository.getCountReservationByDateAndOffType(
          dateObject,
          officeType.id
        );
        officeType.data.push(count);
      }
    }

    const data = {dates: arrayDates, officeTypes: arrayOTypes};
    // Check if Exist
    if (officeTypes.length === 0) {
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

  getDateInit = async (todayFullDate: Date, timeFrame: string) => {
    var dateInit = '';
    switch (timeFrame) {
      case 'week':
        dateInit = await moment(todayFullDate)
          .add(-6, 'day')
          .format('YYYY-MM-DD');
        break;
      case 'month':
        dateInit = await moment(todayFullDate)
          .add(-29, 'day')
          .format('YYYY-MM-DD');
        break;
      case '2months':
        dateInit = await moment(todayFullDate)
          .add(-59, 'day')
          .format('YYYY-MM-DD');
        break;
      case 'year':
        dateInit = await moment(todayFullDate)
          .add(-12, 'month')
          .format('YYYY-MM-DD');
        break;
      default:
        dateInit = await moment(todayFullDate)
          .add(-6, 'day')
          .format('YYYY-MM-DD');
        break;
    }
    return dateInit;
  };

  getDateArray = async (dateInit: Date, timeFrame: string) => {
    var arrayDates = [];
    var totalDays = 0;
    var type = 1;
    switch (timeFrame) {
      case 'week':
        type = 1;
        totalDays = 7;
        break;
      case 'month':
        type = 1;
        totalDays = 30;
        break;
      case '2months':
        type = 1;
        totalDays = 60;
        break;
      case 'year':
        type = 2;
        totalDays = 12;
        break;
      default:
        type = 1;
        totalDays = 7;
        break;
    }

    if (type == 1) {
      for (var i = 1; i <= totalDays; i++) {
        await arrayDates.push(
          moment(dateInit).add(i, 'day').format('YYYY-MM-DD')
        );
      }
    } else {
      for (var i = 1; i <= totalDays; i++) {
        await arrayDates.push(
          moment(dateInit).add(i, 'month').format('YYYY-MM')
        );
      }
    }

    return arrayDates;
  };
}
