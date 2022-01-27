import {Users} from '../../models/Users';
import {Repository} from '../generic';
import {UserClient} from '../../models/UserClient';
import {ConstantsManager} from '../../constants/constantsManager';
// repositories
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';
import {TypePositions} from '../../models/TypePositions';

// export
const {Op, QueryTypes, Sequelize} = require('sequelize');

export class UsersRepository extends Repository {
  private constManager: ConstantsManager = new ConstantsManager();
  private reservationRepository: ReservationOfficeRepository = new ReservationOfficeRepository();

  findStudentByUID = async (uid: string) => {
    const response = await this.one({where: {uid}, include: [UserClient]});
    return response;
  };

  findByUID = async (uid: string) => {
    const response = await this.singleCondition({uid});
    return response;
  };

  findByEmail = async (email: string) => {
    const response = await this.singleCondition({email});
    return response;
  };

  singleConditionUsers = async (email: any) => {
    console.log('email', email);
    return;
  };

  findUserByEmail = async (email: string) => {
    const response = await this.one({
      attributes: [
        'uid',
        'slug',
        'fullName',
        'email',
        'phone',
        'position',
        'password',
        'linkedinProfile',
        'qrCode',
        'document',
        [
          Sequelize.fn(
            'CONCAT',
            // eslint-disable-next-line no-process-env
            this.constManager.getUrlUserImages(),
            Sequelize.col('profileImage')
          ),
          'profileImage'
        ],
        'checkUserId',
        'status',
        'createdAt',
        'updatedAt'
      ],
      where: {
        email
      }
    });
    return response;
  };

  createClient = (data?: Object): Promise<any> => {
    return UserClient.create(data);
  };

  existsUser = async (uid: string) => {
    const user = await this.one({
      where: {
        uid,
        status: 'active'
      }
    });
    return user !== null;
  };

  getUserInfo = async (uid: string) => {
    // this.setModel(Users);
    const user = await this.one({
      where: {
        uid
      },
      attributes: ['uid', 'fullName', 'email', 'phone', 'position']
    });
    // return user;
    return user.dataValues;
  };

  // Status
  changeCheckUserUID = async (
    uid: string,
    checkUserId: number,
    status = 'active'
  ) => {
    await this.update({checkUserId, status}, {uid});
  };

  listUsers = async (
    needle: string,
    limit: number = 50,
    offset: number = 0,
    countReservationsByUser: boolean = false
  ) => {
    const users =
      needle.length === 0
        ? await this.all({limit, offset, order: [['createdAt', 'asc']]})
        : await this.all({
            where: {
              [Op.or]: [
                {fullName: {[Op.substring]: needle}},
                {email: {[Op.substring]: needle}},
                {position: {[Op.substring]: needle}}
              ],
              status: 'active'
            },
            limit,
            offset,
            order: [['createdAt', 'asc']]
          });
    for (const user of users) {
      delete user.dataValues.slug;
      delete user.dataValues.password;
      delete user.dataValues.checkUserId;
      if (user.get('profileImage') !== '')
        user.set(
          'profileImage',
          this.constManager.getUrlUserImages() + user.get('profileImage')
        );

      if (countReservationsByUser == true)
        user.dataValues.amountOfReservations = await this.reservationRepository.countReservationsByUser(
          user.get('uid')
        );
    }
    const totalUsers =
      needle.length === 0
        ? await this.one({
            attributes: [
              [Sequelize.fn('COUNT', Sequelize.col('uid')), 'totalRows']
            ],
            order: [['createdAt', 'asc']]
          })
        : await this.one({
            attributes: [
              [Sequelize.fn('COUNT', Sequelize.col('uid')), 'totalRows']
            ],
            where: {
              [Op.or]: [
                {fullName: {[Op.substring]: needle}},
                {email: {[Op.substring]: needle}},
                {position: {[Op.substring]: needle}}
              ],
              status: 'active'
            },
            order: [['createdAt', 'asc']]
          });

    return {users, total: totalUsers.dataValues.totalRows};
  };

  editUser = async (
    uid: string,
    position: string,
    fullName: string,
    document: string,
    email: string,
    linkedinProfile: string,
    profileImage: string = ''
  ) => {
    const objectUser: any = {
      fullName,
      email,
      document,
      position,
      linkedinProfile
    };
    if (profileImage.length !== 0 && profileImage !== '')
      objectUser.profileImage = profileImage;

    await this.update(objectUser, {uid});
    const user = await this.one({
      where: {
        uid
      }
    });
    user.dataValues.profileImage = `${this.constManager.getUrlUserImages()}${
      user.dataValues.profileImage
    }`;
    return user;
  };

  getBroadReportAboutUser = async (uid: string) => {
    const user = await this.one({
      where: {
        uid
      }
    });
    user.set('password', '');
    user.set(
      'profileImage',
      this.constManager.getUrlUserImages() + user.get('profileImage')
    );
    user.dataValues.listReservations = await this.reservationRepository.listReservationsFromUser(
      uid,
      100,
      0,
      0,
      0,
      ''
    );
    user.dataValues.totalReservations = await this.reservationRepository.countReservationsByUser(
      uid
    );
    user.dataValues.activeReservations = await this.reservationRepository.countReservationsByUser(
      uid,
      'active'
    );
    user.dataValues.cancelledReservations = await this.reservationRepository.countReservationsByUser(
      uid,
      'inactive'
    );
    return user;
  };

  updateUserState = async (uid: string, active: number) => {
    // await this.update({ status: active === 1  ? 'active' : 'inactive' }, {uid});
    return {success: true, message: 'Cambio de estado correcto'};
  };

  existsUserOnDB = async (uid: string) => {
    const user = await this.one({where: {uid}});
    return user !== null;
  };

  changeUserState = async (active: number, uid: string) => {
    await this.update(
      {
        status: active === 1 ? 'active' : 'inactive'
      },
      {uid}
    );
    return await this.one({
      where: {uid}
    });
  };

  getUserInfoById = async (uid: string) => {
    const user = await this.one({
      attributes: [
        'uid',
        'fullName',
        'position',
        'document',
        'email',
        'linkedinProfile',
        'typePositionsId',
        'qrCode',
        'phone',
        [
          Sequelize.fn(
            'CONCAT',
            // eslint-disable-next-line no-process-env
            this.constManager.getUrlUserImages(),
            Sequelize.col('profileImage')
          ),
          'profileImage'
        ]
      ],
      where: {
        uid
      }
    });
    return user;
  };

  constructor() {
    super();
    this.setModel(Users);
  }
}
