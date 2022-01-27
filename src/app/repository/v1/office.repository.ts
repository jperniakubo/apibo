import {Repository} from '../generic';
import {Office} from '../../models/Office';
import {OfficeItems} from '../../models/OfficeItems';
import {OfficeImages} from '../../models/OfficeImages';
import {OfficePlains} from '../../models/OfficePlains';
import {ReservationOffice} from '../../models/ReservationOffice';
import {Users} from '../../models/Users';
import {UsersFavoritesOffices} from '../../models/UsersFavoritesOffices';
import {OfficeArrivalsDirection} from '../../models/OfficeArrivalsDirection';
import {ConstantsManager} from '../../constants/constantsManager';

// others repositories
import {CheckInRepository} from '../../repository/v1/checkIn.repository';
import {CheckOutRepository} from '../../repository/v1/checkOut.repository';
import {UserFavoriteOfficeRepository} from '../../repository/v1/userFavoriteOffice.repository';

import {UsersRepository} from './users.repository';
import {BuildingRepository} from './building.repository';
import {OfficeTypeRepository} from './officeType.repository';
import {FloorBuildingRepository} from './floorBuilding.repository';
import {City} from '../../models/City';
import {OfficeType} from '../../models/OfficeType';
import {FloorBuilding} from '../../models/FloorBuilding';
import {Building} from '../../models/Building';
import {SystemItemIcons} from '../../models/SystemItemIcons';

const {Op, QueryTypes, Sequelize} = require('sequelize');
const moment = require('moment');
// export
export class OfficeRepository extends Repository {
  private userRepository: UsersRepository = new UsersRepository();
  private buildingRepository: BuildingRepository = new BuildingRepository();
  private floorBuildingRepository: FloorBuildingRepository = new FloorBuildingRepository();
  private officeTypeRepository: OfficeTypeRepository = new OfficeTypeRepository();
  private constantsManager: ConstantsManager = new ConstantsManager();
  private checkInRepository = new CheckInRepository();
  private checkOutRepository = new CheckOutRepository();
  private userFavoriteOfficeRepository = new UserFavoriteOfficeRepository();

  getListOfOfficeByFloor = async (
    date: Date,
    startTime: string,
    endTime: string,
    cityId: number,
    buildingId: number,
    officeTypeId: number,
    floorBuildingId: number,
    limit: number,
    offset: number,
    uid: string
  ) => {
    const officesAvailable = [];
    const officesNotAvailable = [];
    let allOffices = [];
    this.setModel(Office);
    const offices = await this.all({
      where: {
        status: 'active',
        cityId,
        buildingId,
        officeTypeId,
        floorBuildingId
      },
      limit,
      offset,
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            [
              Sequelize.fn(
                'CONCAT',
                // eslint-disable-next-line no-process-env
                this.constantsManager.getUrlOfficeImages(),
                Sequelize.col('image')
              ),
              'image'
            ]
          ]
        }
      ]
    });
    for (const office of offices) {
      if (uid !== '' && uid !== null && uid !== undefined)
        office.dataValues.isFavorite = await this.userFavoriteOfficeRepository.isFavoriteOfficeOfUser(
          uid,
          office.get('id')
        );

      const isAvailable = await this.isAvailableOffice(
        date,
        startTime,
        endTime,
        office.get('id')
      );
      if (isAvailable.available == true) {
        office.dataValues.isAvailable = true;
        office.dataValues.reservations = [];
        officesAvailable.push(office);
      } else {
        office.dataValues.isAvailable = false;
        office.dataValues.reservations = isAvailable.data;
        officesNotAvailable.push(office);
      }
    }
    allOffices = officesAvailable.concat(officesNotAvailable);
    return allOffices;
  };

  getAllFilter = async (
    name: string,
    officeTypeId: number,
    buildingId: number,
    cityId: number,
    limit: number,
    offset: number
  ) => {
    let whereObject: any = {};

    if (name) {
      whereObject['name'] = {[Op.substring]: name};
    }
    if (cityId) {
      whereObject['cityId'] = cityId;
    }
    if (buildingId) {
      whereObject['buildingId'] = buildingId;
    }
    if (officeTypeId) {
      whereObject['officeTypeId'] = officeTypeId;
    }
    let office = await this.all({
      attributes: ['id', 'name', 'status'],
      where: whereObject,
      include: [
        {model: City, attributes: ['id', 'name']},
        {model: OfficeType, attributes: ['id', 'name']},
        {model: Building, attributes: ['id', 'name']},
        {model: FloorBuilding, attributes: ['id', 'floor']}
      ],
      limit,
      offset
    });
    const totalBuilding = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < office.length; index++) {
      const officeType = office[index].dataValues;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return {office, totalRows: totalBuilding.dataValues.totalRows};
  };

  getListOffice = async (
    name: string,
    officeTypeId: number,
    buildingId: number,
    cityId: number,
    limit: number,
    offset: number
  ) => {
    this.setModel(Office);
    let whereObject: any = {};

    if (name) {
      whereObject['name'] = {[Op.substring]: name};
    }
    if (cityId) {
      whereObject['cityId'] = cityId;
    }
    if (buildingId) {
      whereObject['buildingId'] = buildingId;
    }
    if (officeTypeId) {
      whereObject['officeTypeId'] = officeTypeId;
    }
    let office = await this.all({
      attributes: ['id', 'name', 'status'],
      where: whereObject,
      include: [
        {model: City, attributes: ['id', 'name']},
        {model: OfficeType, attributes: ['id', 'name']},
        {model: Building, attributes: ['id', 'name']},
        {model: FloorBuilding, attributes: ['id', 'floor']}
      ],
      limit,
      offset
    });
    const totalBuilding = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    return {office, totalRows: totalBuilding.dataValues.totalRows};
  };

  getOneOfficeInfo = async (id: number) => {
    const officeInfo = await this.one({
      where: {
        id
      }
    });

    return officeInfo;
  };

  getOfficeFavoriteInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            ['description', 'description'],
            ['officeId', 'officeId'],
            ['status', 'status'],
            ['createdAt', 'createdAt'],
            [
              Sequelize.fn(
                'CONCAT',
                // eslint-disable-next-line no-process-env
                this.constantsManager.getUrlOfficeImages(),
                Sequelize.col('image')
              ),
              'image'
            ]
          ]
        }
      ]
    });
    officeInfo.dataValues.buildingName = await this.buildingRepository.getBuilingNameById(
      officeInfo.dataValues.buildingId
    );
    officeInfo.dataValues.floorName = await this.floorBuildingRepository.getFloorBuildingNameById(
      officeInfo.dataValues.floorBuildingId
    );
    return officeInfo;
  };

  getAllOffice = async () => {
    const officeInfo = await this.all({
      attributes: ['id', 'name', 'status'],
      include: [
        {
          model: OfficeType,
          attributes: ['name']
        },
        {
          model: FloorBuilding,
          attributes: ['floor']
        },
        {
          model: Building,
          attributes: ['name']
        },
        {
          model: City,
          attributes: ['name']
        }
      ]
    });

    return officeInfo;
  };

  changeStatus = async (id: number, status: string) => {
    const officeInfo = await this.update({status}, {id});

    return officeInfo;
  };

  getFavoritesOfficesOfUser = async (
    uid: string,
    limit: number,
    offset: number
  ) => {
    this.setModel(UsersFavoritesOffices);
    const favoritesOffices = await this.all({
      attributes: ['officeId'],
      where: {
        status: 'active',
        uid
      },
      limit,
      offset
    });
    const response: object[] = [];
    for (const office of favoritesOffices) {
      const officeInfo: any = await this.getOfficeFavoriteInfo(
        parseInt(office.dataValues.officeId)
      );

      response.push(officeInfo);
    }
    return response;
  };

  verifyQrCode = async (qrCode: string) => {
    const existQrCode = await this.one({
      attributes: ['name'],
      where: {
        qrCode
      }
    });
    return {existQrCode: existQrCode !== null};
  };

  isAvailableOffice = async (
    date: Date,
    startTime: string,
    endTime: string,
    officeId: number,
    excludeReservationId: number = 0
  ) => {
    this.setModel(ReservationOffice);
    const whereClause: Object =
      excludeReservationId === 0
        ? {
            attributes: [
              ['id', 'reservationId'],
              ['date', 'reservationDate'],
              ['startTime', 'reservationStartTime'],
              ['endTime', 'reservationEndTime']
            ],
            where: {
              officeId,
              date: {
                [Op.eq]: new Date(date)
              },
              status: 'active'
            }
          }
        : {
            attributes: [
              ['id', 'reservationId'],
              ['date', 'reservationDate'],
              ['startTime', 'reservationStartTime'],
              ['endTime', 'reservationEndTime']
            ],
            where: {
              officeId,
              date: {
                [Op.eq]: new Date(date)
              },
              status: 'active',
              id: {
                [Op.ne]: excludeReservationId
              }
            }
          };
    const office = await this.all(whereClause);
    this.setModel(Office);
    if (office.length === 0)
      return {
        available: true,
        data: {}
      };

    for (const reservation of office) {
      const reservationStartTime: number = this.timeToDecimal(
        reservation.dataValues.reservationStartTime
      );
      const reservationEndTime: number = this.timeToDecimal(
        reservation.dataValues.reservationEndTime
      );
      const newStartTime: number = this.timeToDecimal(startTime);
      const newEndTime: number = this.timeToDecimal(endTime);
      if (
        (newStartTime >= reservationStartTime &&
          newStartTime < reservationEndTime) ||
        (newEndTime > reservationStartTime &&
          newEndTime <= reservationEndTime) ||
        (newStartTime < reservationStartTime && newEndTime > reservationEndTime)
      ) {
        return {
          available: false,
          data: office
        };
      }
    }
    return {
      available: true,
      data: {}
    };
  };

  getImagesFromOffice = async (officeId: number) => {
    this.setModel(OfficeImages);
    const officeImages = await this.all({
      where: {
        officeId,
        status: 'active'
      }
    });
    this.setModel(Office);
    return officeImages;
  };

  timeToDecimal = (time: any) => {
    const arr: any[] = time.split(':');
    const dec: any = (parseInt(arr[1], 10) / 6) * 10;
    return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? '0' : ''}${dec}`);
  };

  getOfficeInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            [
              Sequelize.fn(
                'CONCAT',
                this.constantsManager.getUrlOfficeImages(),
                Sequelize.col('officeImages.image')
              ),
              'image'
            ]
          ]
        },
        {
          model: OfficeItems,
          include: [
            {
              model: SystemItemIcons,
              attributes: ['id', 'svg', 'png']
            }
          ]
        },
        {
          model: OfficePlains,
          attributes: [
            'id',
            'description',
            'officeId',
            'status',
            'createdAt',
            [
              Sequelize.fn(
                'CONCAT',
                // eslint-disable-next-line no-process-env
                this.constantsManager.getUrlOfficePlains(),
                Sequelize.col('officePlains.image')
              ),
              'image'
            ]
          ]
        },
        OfficeArrivalsDirection
      ]
    });

    if (officeInfo !== null) {
      officeInfo.dataValues.buildingInfo = await this.buildingRepository.getInfoBuildingAndYourCity(
        officeInfo.dataValues.buildingId
      );
      officeInfo.dataValues.officeTypeInfo = await this.officeTypeRepository.getOfficeTypeInfo(
        officeInfo.dataValues.officeTypeId
      );
      officeInfo.dataValues.floorBuildingInfo = await this.floorBuildingRepository.getIinfoFloorById(
        officeInfo.dataValues.floorBuildingId
      );
      return officeInfo.dataValues;
    } else {
      return officeInfo;
    }
  };

  getBasicOfficeInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      attributes: [
        ['name', 'officeName'],
        ['buildingId', 'buildingId'],
        ['officeTypeId', 'officeTypeId'],
        ['floorBuildingId', 'floorBuildingId']
      ],
      where: {
        id,
        status: 'active'
      }
    });

    if (officeInfo !== null) {
      const buildingData = await this.buildingRepository.getBuildingInfo(
        officeInfo.dataValues.buildingId
      );
      const floorData = await this.floorBuildingRepository.getFloorInfoById(
        officeInfo.dataValues.floorBuildingId
      );
      officeInfo.dataValues.buildingName = buildingData.buildingName;
      officeInfo.dataValues.floorName = floorData.floorName;
      return officeInfo.dataValues;
    } else {
      return officeInfo;
    }
  };

  addOfficeToFavorites = async (officeId: number, uid: string) => {
    this.setModel(UsersFavoritesOffices);

    // remove from list
    const office = await this.officeBelongToUserFavoritesList(officeId, uid);
    if (office !== null) {
      const id: number = office.getDataValue('id');
      await this.destroy({id});
      return {success: true, message: 'Eliminado de la lista de favoritos'};
    }

    await this.create({
      uid,
      officeId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {success: true, message: 'Agregado a la lista de favoritos'};
  };

  officeBelongToUserFavoritesList = async (officeId: number, uid: string) => {
    this.setModel(UsersFavoritesOffices);
    const belongToList = await this.one({
      where: {
        uid,
        officeId,
        status: 'active'
      }
    });
    return belongToList;
  };

  existsOffice = async (officeId: number) => {
    const office = await this.all({
      where: {
        id: officeId,
        status: 'active'
      }
    });
    return office.length !== 0;
  };

  getOfficeById = async (officeId: number) => {
    const office = await this.all({
      where: {
        id: officeId,
        status: 'active'
      }
    });
    return office;
  };

  reservationOffice = async (
    date: Date,
    startTime: string,
    endTime: string,
    uid: string,
    leadReservationUid: string,
    officeId: number
  ) => {
    this.setModel(ReservationOffice);
    await this.create({
      date,
      startTime,
      endTime,
      uid,
      leadReservationUid,
      officeId
    });
    const lastReservation = await this.one({
      where: {
        date: new Date(date),
        startTime,
        endTime,
        uid,
        leadReservationUid,
        officeId
      },
      order: [['createdAt', 'DESC']]
    });
    this.setModel(Office);
    return await this.getInfoAboutReservation(lastReservation.dataValues.id);
  };

  listUserReservations = async (
    uid: string,
    cityId: number,
    buildingId: number,
    officeTypeId: number,
    status: string,
    limit: number,
    offset: number,
    columnOrder: string,
    sortBy: string
  ) => {
    moment.locale('es');
    let whereObjectUser: any = {};
    let whereObjectBuilding: any = {};
    let whereObjectCity: any = {};
    let whereObjectOfficeType: any = {};
    let whereObjectStatus: any = {};

    whereObjectUser['uid'] = uid;
    if (cityId !== 0) {
      whereObjectCity['id'] = cityId;
    }
    if (buildingId !== 0) {
      whereObjectBuilding['id'] = buildingId;
    }
    if (officeTypeId !== 0) {
      whereObjectOfficeType['id'] = officeTypeId;
    }
    if (status !== '') {
      whereObjectStatus['status'] = status;
    }
    this.setModel(ReservationOffice);
    let reservations = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      where: whereObjectStatus,
      include: [
        {model: Users, attributes: ['fullName'], where: whereObjectUser},
        {
          model: Office,
          attributes: [['id', 'officeId'], 'name'],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: City,
              attributes: [['id', 'cityId'], 'name'],
              where: whereObjectCity
            },
            {
              model: Building,
              attributes: [['id', 'buildingId'], 'name'],
              where: whereObjectBuilding
            },
            {
              model: OfficeType,
              attributes: [['id', 'officeTypeId'], 'name'],
              where: whereObjectOfficeType
            }
          ]
        }
      ],
      limit,
      offset,
      order: [[Sequelize.col(columnOrder), sortBy]]
    });
    const totalReservations = await this.one({
      attributes: [
        [
          Sequelize.fn('COUNT', Sequelize.col('ReservationOffice.id')),
          'totalRows'
        ]
      ],
      where: whereObjectStatus,
      include: [
        {
          model: Users,
          attributes: ['fullName'],
          where: whereObjectUser
        },
        {
          model: Office,
          attributes: [['id', 'officeId']],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: City,
              attributes: [['id', 'cityId']],
              where: whereObjectCity
            },
            {
              model: Building,
              attributes: [['id', 'buildingId']],
              where: whereObjectBuilding
            },
            {
              model: OfficeType,
              attributes: [['id', 'officeTypeId']],
              where: whereObjectOfficeType
            }
          ]
        }
      ]
    });
    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < reservations.length; index++) {
      reservations[index].dataValues.startTime = await moment(
        new Date(
          reservations[index].dataValues.date +
            ' ' +
            reservations[index].dataValues.startTime
        )
      ).format('HH:mm A');
      reservations[index].dataValues.endTime = await moment(
        new Date(
          reservations[index].dataValues.date +
            ' ' +
            reservations[index].dataValues.endTime
        )
      ).format('HH:mm A');
      reservations[index].dataValues.date = await moment(
        reservations[index].dataValues.date
      ).format('DD/MMM/YYYY');
      // const officeType = reservations[index].dataValues;
      // officeType.image = String(constantsManager) + officeType.image;
    }
    return {reservations, totalRows: totalReservations.dataValues.totalRows};
  };

  getInfoUserReservation = async (
    reservationId: number,
    reservationOfficeId: number,
    reservationUid: string,
    reservationLeadUid: string
  ) => {
    const reservation = {
      checkInIsDone: false,
      checkOutIsDone: false,
      userInfo: {},
      officeInfo: {},
      leadReservationInfo: {}
    };
    this.setModel(ReservationOffice);
    reservation.checkInIsDone = await this.checkInRepository.checkInIsDone(
      reservationId,
      reservationOfficeId
    );
    reservation.checkOutIsDone = await this.checkOutRepository.checkOutIsDone(
      reservationId,
      reservationOfficeId
    );
    this.setModel(Office);
    reservation.userInfo = await this.userRepository.getUserInfo(
      reservationUid
    );
    const officeInfo = await this.getOfficesInfo(reservationOfficeId);
    reservation.officeInfo = officeInfo;
    reservation.leadReservationInfo = await this.userRepository.getUserInfo(
      reservationLeadUid
    );
    return reservation;
  };

  getOfficesInfo = async (id: number) => {
    this.setModel(Office);
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        {
          model: OfficeImages,
          attributes: [
            ['id', 'imageId'],
            [
              Sequelize.fn(
                'CONCAT',
                this.constantsManager.getUrlOfficeImages(),
                Sequelize.col('officeImages.image')
              ),
              'imgOffice'
            ]
          ]
        },
        {
          model: OfficeItems,
          attributes: [
            ['id', 'officeItemId'],
            ['name', 'officeItemName'],
            ['image', 'imgItem']
          ]
        },
        {
          model: OfficePlains,
          attributes: [
            ['id', 'officePlainId'],
            [
              Sequelize.fn(
                'CONCAT',
                // eslint-disable-next-line no-process-env
                this.constantsManager.getUrlOfficePlains(),
                Sequelize.col('officePlains.image')
              ),
              'imgPlain'
            ]
          ]
        },
        {
          model: OfficeArrivalsDirection,
          attributes: [
            ['id', 'arrivalsDirId'],
            ['description', 'arrivalDescription']
          ]
        }
      ]
    });

    if (officeInfo !== null) {
      officeInfo.dataValues.buildingInfo = await this.buildingRepository.getInfoBuildingById(
        officeInfo.dataValues.buildingId
      );
      officeInfo.dataValues.officeTypeInfo = await this.officeTypeRepository.getOfficeTypeById(
        officeInfo.dataValues.officeTypeId
      );
      officeInfo.dataValues.floorBuildingInfo = await this.floorBuildingRepository.getIFloorInfoById(
        officeInfo.dataValues.floorBuildingId
      );
      return officeInfo.dataValues;
    } else {
      return officeInfo;
    }
  };

  exitsAndIsActiveReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId,
        status: 'active'
      }
    });
    return reservation !== null;
  };

  getInfoAboutReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    reservation.dataValues.checkInIsDone = await this.checkInRepository.checkInIsDone(
      reservationId,
      reservation.dataValues.officeId
    );
    reservation.dataValues.checkOutIsDone = await this.checkOutRepository.checkOutIsDone(
      reservationId,
      reservation.dataValues.officeId
    );
    this.setModel(Office);
    reservation.dataValues.userInfo = await this.userRepository.getUserInfo(
      reservation.dataValues.uid
    );
    const officeInfo = await this.getOfficeInfo(
      reservation.dataValues.officeId
    );
    reservation.dataValues.officeInfo = officeInfo;
    reservation.dataValues.leadReservationInfo = await this.userRepository.getUserInfo(
      reservation.dataValues.leadReservationUid
    );
    return reservation;
  };

  cancelReservation = async (reservationId: number) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    await reservation.update({status: 'inactive'});
  };

  updateReservation = async (
    reservationId: number,
    date: Date,
    startTime: string,
    endTime: string,
    leadReservationUid: string,
    officeId: number
  ) => {
    this.setModel(ReservationOffice);
    const reservation = await this.one({
      where: {
        id: reservationId
      }
    });
    await reservation.update({
      date,
      startTime,
      endTime,
      leadReservationUid,
      officeId
    });
    return {success: true, message: 'Ok'};
  };

  checkQrOffice = async (officeId: number, code: string) => {
    const office = await this.one({
      where: {
        id: officeId,
        qrCode: code,
        status: 'active'
      }
    });
    return office !== null;
  };

  constructor() {
    super();
    this.setModel(Office);
  }

  getTodayDate(dateToday: Date) {
    const month =
      dateToday.getMonth() + 1 < 10
        ? `0${dateToday.getMonth() + 1}`
        : dateToday.getMonth() + 1;
    const day =
      dateToday.getDate() < 10
        ? `0${dateToday.getDate()}`
        : dateToday.getDate();
    return `${dateToday.getFullYear()}-${month}-${day}`;
  }

  getTodayHour(dateToday: Date) {
    const hour =
      dateToday.getHours() < 10
        ? `0${dateToday.getHours()}`
        : dateToday.getHours();
    const minutes =
      dateToday.getMinutes() < 10
        ? `0${dateToday.getMinutes()}`
        : dateToday.getMinutes();
    return `${hour}:${minutes}`;
  }

  getAll = async (limit: number, offset: number) => {
    const response = await this.all();

    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < response.length; index++) {
      const officeType = response[index].dataValues;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return response;
  };

  filter = async (name: string) => {
    const response = await this.all({
      where: {name: {[Op.substring]: name}}
    });

    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < response.length; index++) {
      const officeType = response[index].dataValues;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return response;
  };

  getOne = async (id: number) => {
    const officeInfo = await this.one({
      where: {
        id,
        status: 'active'
      },
      include: [
        OfficeImages,
        {
          model: OfficeItems,
          include: [
            {
              model: SystemItemIcons,
              attributes: ['id', 'svg', 'png']
            }
          ]
        },
        OfficePlains
      ]
    });

    return officeInfo;
  };

  getById = async (id: number) => {
    const officeInfo = await this.one({
      where: {
        id
      },
      include: [
        OfficeImages,
        {
          model: OfficeItems,
          include: [
            {
              model: SystemItemIcons,
              attributes: ['id', 'svg', 'png']
            }
          ]
        },
        OfficePlains
      ]
    });

    return officeInfo;
  };

  getCreated = async (
    name: string,
    cityId: number,
    buildingId: number,
    officeTypeId: number,
    floorBuildingId: number,
    description: string
  ) => {
    const officeInfo = await this.one({
      where: {
        name,
        cityId,
        buildingId,
        officeTypeId,
        floorBuildingId,
        description
      },
      order: [['id', 'DESC']]
    });

    return officeInfo;
  };

  getAllPage = async (limit: number, offset: number) => {
    const response = await this.all({
      where: {status: 'active'},
      limit: limit,
      offset: offset
    });
    const constantsManager = new ConstantsManager().getUrlBuildingImages();
    for (let index = 0; index < response.length; index++) {
      const officeType = response[index].dataValues;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return response;
  };

  createOffice = async (request: any) => {
    const response = await this.create(request);

    return response;
  };

  updateStatus = async (id: number, status: string) => {
    const officeInfo = await this.update({status}, {id});

    return officeInfo;
  };

  updateOfficeType = async (req: string, id: number) => {
    const officeInfo = await this.update(req, {id});

    return officeInfo;
  };
}
