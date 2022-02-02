import {Repository} from '../generic';
import {ReservationOffice} from '../../models/ReservationOffice';
import {Office} from '../../models/Office';
import {ConstantsManager} from '../../constants/constantsManager';
import {Op, Sequelize} from 'sequelize';
import {City} from '../../models/City';
import {Building} from '../../models/Building';
import {OfficeType} from '../../models/OfficeType';
import {Users} from '../../models/Users';
import {CheckIn} from '../../models/CheckIn';
import {CheckOut} from '../../models/CheckOut';
import {ImagesCheckIn} from '../../models/ImagesCheckIn';
import {ItemsCheckIn} from '../../models/ItemsCheckIn';
import {ImagesCheckOut} from '../../models/ImagesCheckOut';
import {ItemsCheckOut} from '../../models/ItemsCheckOut';
import {FloorBuilding} from '../../models/FloorBuilding';
import {OfficeItems} from '../../models/OfficeItems';
import {OfficeImages} from '../../models/OfficeImages';
import {SystemItemIcons} from '../../models/SystemItemIcons';

const moment = require('moment');
// export
export class ReservationOfficeRepository extends Repository {
  countReservationsByUser = async (uid: string, flag: string = 'all') => {
    let whereClause: any;
    if (flag === 'all') {
      whereClause = {
        where: {
          uid: uid
        }
      };
    } else {
      whereClause = {
        where: {
          uid: uid,
          status: flag
        }
      };
    }
    const amountOfReservations = await this.all(whereClause);
    return amountOfReservations.length;
  };

  listReservationsFromUser = async (
    uid: string,
    limit: number,
    offset: number,
    buildingId: number,
    officeId: number,
    date: Date | string
  ) => {
    const reservations = await this.all({
      where: {
        leadReservationUid: uid
      },
      order: [['date', 'ASC']]
    });

    return reservations;
  };

  changeReservationState = async (id: number, status: string) => {
    await this.update({status: status}, {id});
  };

  getAllFilter = async (
    fullName: string,
    cityId: number,
    buildingId: number,
    officeTypeId: number,
    status: string,
    limit: number,
    offset: number,
    columnOrder: string,
    sortBy: string
  ) => {
    let whereObjectUser: any = {};
    let whereObjectBuilding: any = {};
    let whereObjectCity: any = {};
    let whereObjectOfficeType: any = {};
    let whereObjectStatus: any = {};

    if (fullName) {
      whereObjectUser['fullName'] = {[Op.substring]: fullName};
    }
    if (cityId) {
      whereObjectCity['id'] = cityId;
    }
    if (buildingId) {
      whereObjectBuilding['id'] = buildingId;
    }
    if (officeTypeId) {
      whereObjectOfficeType['id'] = officeTypeId;
    }
    if (status) {
      whereObjectStatus['status'] = status;
    }

    let reservations = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      where: whereObjectStatus,
      include: [
        {model: Users, attributes: ['fullName'], where: whereObjectUser},
        {
          model: Office,
          attributes: ['id', 'name'],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {model: City, attributes: ['id', 'name'], where: whereObjectCity},
            {
              model: Building,
              attributes: ['id', 'name'],
              where: whereObjectBuilding
            },
            {
              model: OfficeType,
              attributes: ['id', 'name'],
              where: whereObjectOfficeType
            }
          ]
        }
      ],
      limit,
      offset,
      order: [[Sequelize.col(columnOrder), sortBy]]
    });

    const totalBuilding = await this.one({
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
              attributes: [['id', 'offTypeId']],
              where: whereObjectOfficeType
            }
          ]
        }
      ]
    });
    // const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    // for (let index = 0; index < reservations.length; index++) {
    //   const officeType = reservations[index].dataValues;
    //   officeType.image = String(constantsManager) + officeType.image;
    // }
    return {reservations, totalRows: totalBuilding.dataValues.totalRows};
  };

  getAllByDateAndOffice = async (
    officeName: string,
    date: string,
    limit: number,
    offset: number
  ) => {
    let whereObjectOffice: any = {};
    let whereObjectDate: any = {};

    if (officeName) {
      whereObjectOffice['name'] = {[Op.substring]: officeName};
    }
    if (date) {
      // whereObjectDate['date'] = date;
      whereObjectDate['date'] = {[Op.startsWith]: date};
    }

    let reservations = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      where: whereObjectDate,
      include: [
        {model: Users, attributes: ['fullName']},
        {
          model: Office,
          attributes: ['id', 'name'],
          where: whereObjectOffice,
          include: [
            {model: City, attributes: ['id', 'name']},
            {model: Building, attributes: ['id', 'name']},
            {model: OfficeType, attributes: ['id', 'name']}
          ]
        }
      ],
      limit,
      offset,
      order: [[Sequelize.col('ReservationOffice.startTime'), 'ASC']]
    });

    const totalBuilding = await this.one({
      attributes: [
        [
          Sequelize.fn('COUNT', Sequelize.col('ReservationOffice.id')),
          'totalRows'
        ]
      ],
      where: whereObjectDate,
      include: [
        {model: Users, attributes: ['fullName']},
        {
          model: Office,
          attributes: [['id', 'officeId']],
          where: whereObjectOffice,
          include: [
            {model: City, attributes: [['id', 'cityId']]},
            {model: Building, attributes: [['id', 'buildingId']]},
            {model: OfficeType, attributes: [['id', 'offTypeId']]}
          ]
        }
      ]
    });
    return {reservations, totalRows: totalBuilding.dataValues.totalRows};
  };

  verifyReservationExpired = async () => {
    moment.locale('es');
    const dateToday = new Date();
    const todayDate = moment(dateToday).format('YYYY-MM-DD');
    const todayHour = moment(dateToday).format('HH:mm');

    const allReservations = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      where: {
        status: 'active',
        date: {[Op.lte]: todayDate}
      }
    });

    if (allReservations !== null) {
      for (const reservation of allReservations) {
        if (reservation.dataValues.date === todayDate) {
          if (reservation.dataValues.endTime < todayHour) {
            this.changeReservationState(reservation.dataValues.id, 'expired');
          }
        } else {
          this.changeReservationState(reservation.dataValues.id, 'expired');
        }
      }
    }

    return true;
  };

  getAll = async (limit: number, offset: number) => {
    const response = await this.all({
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      include: [
        {model: Users, attributes: ['fullName']},
        {
          model: Office,
          attributes: ['id', 'name'],
          include: [
            {model: City, attributes: ['id', 'name']},
            {model: Building, attributes: ['id', 'name']},
            {model: OfficeType, attributes: ['id', 'name']}
          ]
        }
      ]
    });

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
        id
      },

      include: [
        {model: Users},
        {
          model: CheckIn,
          include: [
            ImagesCheckIn,
            {
              model: OfficeItems,
              include: [
                {
                  model: SystemItemIcons,
                  attributes: ['id', 'svg', 'png']
                }
              ]
            }
          ]
        },
        {
          model: CheckOut,
          include: [
            ImagesCheckOut,
            {
              model: OfficeItems,
              include: [
                {
                  model: SystemItemIcons,
                  attributes: ['id', 'svg', 'png']
                }
              ]
            }
          ]
        },
        {
          model: Office,
          include: [
            {model: City},
            {model: Building},
            {model: OfficeType},
            {model: OfficeImages},
            {model: FloorBuilding}
          ]
        }
      ]
    });

    if (officeInfo) {
      const constantsManager = new ConstantsManager();
      const officeType = officeInfo.dataValues;

      if (
        officeType.users.dataValues.profileImage != '' ||
        officeType.users.dataValues.profileImage != null ||
        officeType.users.dataValues.profileImage != undefined
      ) {
        officeType.users.dataValues.profileImage =
          String(constantsManager.getUrlUserImages()) +
          officeType.users.dataValues.profileImage;
      }

      // if (
      //   officeType.checkIn.length != 0 &&
      //   officeType.checkIn[0].dataValues.imagesCheckIn.length != 0
      // ) {
      //   officeType.checkIn[0].dataValues.imagesCheckIn.forEach(
      //     (element: any) => {
      //       element.dataValues.image =
      //         String(constantsManager.getUrlCheckInImages()) +
      //         element.dataValues.image;
      //     }
      //   );
      // }
      // if (
      //   officeType.checkOut.length != 0 &&
      //   officeType.checkOut[0].dataValues.imagesCheckOut.length != 0
      // ) {
      //   officeType.checkOut[0].dataValues.imagesCheckOut.forEach(
      //     (element: any) => {
      //       element.dataValues.image =
      //         String(constantsManager.getUrlCheckOutImages()) +
      //         element.dataValues.image;
      //     }
      //   );
      // }
    }

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

  getAllReservations = async (dateInit: string, dateEnd: string) => {
    // console.log('aqui');
    const response = await this.all({
      attributes: [
        'id',
        [Sequelize.fn('count', Sequelize.col('status')), 'status_count']
      ],
      group: 'status',
      where: {date: {[Op.between]: [dateInit, dateEnd]}}
    });

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

  updateReservationOffice = async (req: string, id: number) => {
    const officeInfo = await this.update(req, {id});

    return officeInfo;
  };

  getReservationById = async (id: number) => {
    const reservationInfo = await this.one({
      attributes: [
        ['id', 'reservationId'],
        ['date', 'dateReservation'],
        ['officeId', 'officId']
      ],
      where: {
        id
      }
    });

    reservationInfo;

    return reservationInfo;
  };

  getReservationDates = async (dateInit: string, dateEnd: string) => {
    const dates = await this.all({
      where: {
        date: {[Op.between]: [dateInit, dateEnd]},
        [Op.or]: [{status: 'used'}, {status: 'inactive'}]
      },
      attributes: ['date'],
      group: ['date'],
      order: [['date', 'ASC']]
    });

    return dates;
  };

  getReservationCities = async (dateInit: string, dateEnd: string) => {
    console.log('dateInit, dateEnd', dateInit, dateEnd);
    const cities = await this.all({
      where: {
        date: {[Op.between]: [dateInit, dateEnd]}
        //[Op.or]: [{status: 'active'}]
      },
      include: [
        {
          model: Office,
          attributes: [
            'id'
            // 'name'
          ],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: City,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      group: ['office.city.id'],
      limit: 3
      // order: [['countCities', 'DESC']]
    });

    return cities;
  };

  getReservationOfficeType = async (dateInit: string, dateEnd: string) => {
    const oTypes = await this.all({
      attributes: [
        'id',
        'date',
        [
          Sequelize.fn('count', Sequelize.col('office.officeType.id')),
          'countOffType'
        ]
      ],
      where: {
        date: {[Op.between]: [dateInit, dateEnd]}
      },
      include: [
        {
          model: Office,
          attributes: ['id'],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: OfficeType,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      group: ['office.officeType.id'],
      limit: 4
      // order: [['countCities', 'DESC']]
    });

    return oTypes;
  };

  getCounReservationByDateAndStatus = async (date: string, status: string) => {
    const response = await this.one({
      attributes: [
        'id',
        'date',
        [Sequelize.fn('count', Sequelize.col('id')), 'rowCount']
      ],
      where: {
        date: {[Op.startsWith]: date},
        status
      }
    });
    // console.log(response.dataValues);
    return response.dataValues.rowCount;
  };

  getCountReservationByDateAndCity = async (date: string, cityId: number) => {
    const response = await this.one({
      attributes: [
        'id',
        'date',
        [
          Sequelize.fn('count', Sequelize.col('ReservationOffice.id')),
          'rowCount'
        ]
      ],
      where: {
        date: {[Op.startsWith]: date},
        status: {
          [Op.or]: ['active']
        }
        // Sequelize.where(Sequelize.col('id'): cityId)
      },
      include: [
        {
          model: Office,
          attributes: ['id'],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: City,
              attributes: ['id', 'name'],
              where: {
                id: cityId
              }
            }
          ]
        }
      ]
    });
    return response.dataValues.rowCount;
  };

  getCountReservationByDateAndOffType = async (
    date: string,
    officeTypeId: number
  ) => {
    const response = await this.one({
      attributes: [
        'id',
        'date',
        [
          Sequelize.fn('count', Sequelize.col('ReservationOffice.id')),
          'rowCount'
        ]
      ],
      where: {
        date: {[Op.startsWith]: date},
        status: {
          [Op.or]: ['used', 'active']
        }
      },
      include: [
        {
          model: Office,
          attributes: ['id'],
          where: {
            id: {
              [Op.ne]: null
            }
          },
          include: [
            {
              model: OfficeType,
              attributes: ['id', 'name'],
              where: {
                id: officeTypeId
              }
            }
          ]
        }
      ]
    });
    return response.dataValues.rowCount;
  };

  constructor() {
    super();
    this.setModel(ReservationOffice);
  }
}
