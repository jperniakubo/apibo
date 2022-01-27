import {Repository} from '../generic';
import {BoAdmin} from '../../models/BoAdmin';
import {RoleAdmin} from '../../models/RoleAdmin';
import {ConstantsManager} from '../../constants/constantsManager';
import {LogPwdAdminRepository} from '../../repository/v1/logPwdAdmin.repository';

const {Op, QueryTypes, Sequelize} = require('sequelize');

// export
export class OnboardingAdminRepository extends Repository {
  private constManager: ConstantsManager = new ConstantsManager();
  private logPwdAdminRepository: LogPwdAdminRepository = new LogPwdAdminRepository();

  // check by email or id
  existsAdmin = async (identifier: string | number) => {
    this.setModel(BoAdmin);
    let whereObject: object;
    whereObject =
      typeof identifier === 'string'
        ? {where: {email: identifier}}
        : {where: {id: identifier}};

    const admin = await this.one(whereObject);
    return admin !== null;
  };

  isActiveAdmin = async (email: string) => {
    const admin = await this.one({
      where: {
        email: email,
        status: 'active'
      }
    });
    return admin !== null;
  };

  loginAdmin = async (email: string, password: string) => {
    const admin = await this.one({
      attributes: [
        'id',
        'fullName',
        'email',
        'position',
        'phoneNumber',
        'firstLogin',
        'roleAdminId',
        [
          Sequelize.fn(
            'CONCAT',
            this.constManager.getUrlBoAdminAvatar(),
            Sequelize.col('profileImage')
          ),
          'profileImage'
        ]
      ],
      where: {
        email: email,
        password: password,
        status: 'active'
      }
    });
    if (admin) delete admin.dataValues.password;

    return admin;
  };

  // for now this function is deprecated... it was replaced by: searchAdmins
  listAdmins = async (limit: number, offset: number, needle: string = '') => {
    console.log('el needle es: ' + needle);

    let whereClause: Object =
      needle.length === 0
        ? {}
        : {
            [Op.or]: [
              {fullName: {[Op.substring]: needle}},
              {email: {[Op.substring]: needle}}
            ]
          };
    whereClause = {
      ...whereClause,
      limit: limit,
      offset: offset,
      attributes: {exclude: ['password']}
    };
    return await this.all(whereClause);
  };

  searchAdmins = async (needle: string, limit: number, offset: number) => {
    //console.log('el needle es', needle);
    const admins = await this.all({
      where: {
        [Op.or]: [
          {
            fullName: {[Op.like]: '%' + needle + '%'}
          },
          {
            email: {[Op.like]: '%' + needle + '%'}
          }
        ]
      },
      limit, // by default,
      offset
    });

    const totalAdmins = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: {
        [Op.or]: [
          {
            fullName: {[Op.like]: '%' + needle + '%'}
          },
          {
            email: {[Op.like]: '%' + needle + '%'}
          }
        ]
      }
    });

    return {admins, total: totalAdmins.dataValues.totalRows};
  };

  createAdmin = async (
    fullName: string,
    position: string,
    email: string,
    password: string,
    profileImage: string,
    roleAdminId: number,
    phoneNumber: number
  ) => {
    let adminPhone = 0;
    if (phoneNumber !== 0) {
      adminPhone = phoneNumber;
    }
    // if (profileImage!='') {
    //   profileImage = this.constManager.getUrlBoAdminAvatar() + profileImage
    // }
    await this.create({
      fullName: fullName,
      position: position,
      email: email,
      password: password,
      profileImage: profileImage,
      documentType: '',
      document: '',
      roleAdminId: roleAdminId,
      phoneNumber: adminPhone,
      status: 'active',
      firstLogin: 'Y',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const newAdmin = await this.one({
      where: {
        email: email
      },
      attributes: {exclude: ['password']}
    });
    newAdmin.dataValues.profileImage =
      String(new ConstantsManager().getUrlBoAdminAvatar()) +
      newAdmin.dataValues.profileImage;
    newAdmin.dataValues.code = 100;
    return newAdmin;
  };

  changeAdminState = async (active: number, id: number) => {
    await this.update(
      {
        status: active === 1 ? 'active' : 'inactive'
      },
      {id}
    );
    return await this.one({
      where: {id: id}
    });
  };

  updateAdmin = async (
    id: number,
    fullName: string,
    email: string,
    phoneNumber: number,
    position: string,
    oldPassword: string,
    newPassword: string,
    roleAdminId: number,
    profileImage: string = ''
  ) => {
    const admin = await this.one({
      where: {
        id: id
      }
    });
    let adminDataToUpdate: any = {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      position: position,
      roleAdminId: roleAdminId
    };
    if (newPassword !== '') {
      // if (admin.dataValues.password !== oldPassword)
      //   return {success: false, message: 'La contraseña actual es incorrecta'};

      adminDataToUpdate.password = newPassword;
      adminDataToUpdate.firstLogin = 'N';
      // await this.logPwdAdminRepository.updateLogPwdByAdminId(id);
    }
    if (profileImage !== '') adminDataToUpdate.profileImage = profileImage;

    if (await this.existsAnotherAdminWithSameEmail(id, email))
      return {
        success: false,
        message: 'Existe otro usuario con el nuevo correo ingresado'
      };

    await this.update(adminDataToUpdate, {email});
    const newAdminData = await this.one({
      where: {
        email: email
      }
    });
    newAdminData.set('password', '');
    if (newAdminData.get('profileImage') !== '')
      newAdminData.set(
        'profileImage',
        this.constManager.getUrlBoAdminAvatar() +
          newAdminData.get('profileImage')
      );

    return {
      success: true,
      message: 'Datos actualizados correctamente',
      adminData: newAdminData.dataValues
    };
  };

  existsAnotherAdminWithSameEmail = async (id: number, email: string) => {
    const admin = await this.one({
      where: {
        [Op.and]: [{email: email}, {id: {[Op.ne]: id}}]
      }
    });
    return admin !== null;
  };

  getAdminInfoById = async (boAdminId: number) => {
    const admin = await this.one({
      where: {
        id: boAdminId
      }
    });
    admin.set('password', '');
    if (admin.get('profileImage') !== '')
      admin.set(
        'profileImage',
        this.constManager.getUrlBoAdminAvatar() + admin.get('profileImage')
      );

    return admin;
  };

  getAllRolesAdmin = async () => {
    this.setModel(RoleAdmin);
    const roles = await this.all({
      attributes: ['id', 'name'],
      where: {
        status: 'active'
      }
    });
    this.setModel(BoAdmin);
    return roles;
  };

  constructor() {
    super();
    this.setModel(BoAdmin);
  }
}
