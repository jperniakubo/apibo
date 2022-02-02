import {Repository} from '../generic';
import {OfficeType} from '../../models/OfficeType';
import {ConstantsManager} from '../../constants/constantsManager';
import {Office} from '../../models/Office';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class OfficeTypeRepository extends Repository {
  getOfficeTypeInfo = async (officeTypeId: number) => {
    this.setModel(OfficeType);
    const officeTypeInfo = await this.one({
      where: {
        id: officeTypeId,
        status: 'active'
      }
    });
    return officeTypeInfo.dataValues;
  };

  getOfficeTypeById = async (officeTypeId: number) => {
    this.setModel(OfficeType);
    const officeTypeInfo = await this.one({
      attributes: ['id', 'name', 'description', 'image'],
      where: {
        id: officeTypeId,
        status: 'active'
      }
    });
    return officeTypeInfo.dataValues;
  };

  getAll = async (limit: number, offset: number) => {
    const response = await this.all();

    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < response.length; index++) {
      const officeType = response[index].dataValues;
      officeType.slug = String(constantsManager) + officeType.slug;
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
      officeType.slug = String(constantsManager) + officeType.slug;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return response;
  };

  getAllFilter = async (name: string, limit: number, offset: number) => {
    let whereObject: any = {};
    if (name) {
      whereObject['name'] = {[Op.substring]: name};
    }
    const officeTypes = await this.all({
      where: whereObject,
      limit,
      offset
    });

    const totalOffice = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    const constantsManager = new ConstantsManager().getUrlOfficeTypeImages();
    for (let index = 0; index < officeTypes.length; index++) {
      const officeType = officeTypes[index].dataValues;
      officeType.slug = String(constantsManager) + officeType.slug;
      officeType.image = String(constantsManager) + officeType.image;
    }
    return {officeTypes, totalrows: totalOffice.dataValues.totalRows};
  };

  getOne = async (id: number) => {
    const officeInfo = await this.one({
      where: {
        id
      }
    });

    return officeInfo;
  };

  getAllPage = async (limit: number, offset: number) => {
    const response = await this.all({
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

  constructor() {
    super();
    this.setModel(OfficeType);
  }
}
