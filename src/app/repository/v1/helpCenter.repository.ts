import {Repository} from '../generic';
import {HelpCenter} from '../../models/HelpCenter';
import {ConstantsManager} from '../../constants/constantsManager';
import {Office} from '../../models/Office';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class HelpCenterRepository extends Repository {
  getHelpCenterInfo = async (helpCenterId: number) => {
    this.setModel(HelpCenter);
    const helpCenterInfo = await this.one({
      where: {
        id: helpCenterId,
        status: 'active'
      }
    });
    return helpCenterInfo.dataValues;
  };

  getHelpCenterById = async (helpCenterId: number) => {
    this.setModel(HelpCenter);
    const helpCenterInfo = await this.one({
      where: {
        id: helpCenterId,
        status: 'active'
      }
    });
    return helpCenterInfo.dataValues;
  };

  getAll = async (limit: number, offset: number) => {
    const response = await this.all();

    return response;
  };

  filter = async (name: string) => {
    const response = await this.all({
      where: {question: {[Op.substring]: name}}
    });

    return response;
  };

  getAllFilter = async (question: string, limit: number, offset: number) => {
    let whereObject: any = {};
    if (question) {
      whereObject['question'] = {[Op.substring]: question};
    }
    const helpCenters = await this.all({
      where: whereObject,
      limit,
      offset
    });

    const totalOffice = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    return {helpCenters, totalrows: totalOffice.dataValues.totalRows};
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

  updateHelpCenter = async (req: string, id: number) => {
    const officeInfo = await this.update(req, {id});

    return officeInfo;
  };

  constructor() {
    super();
    this.setModel(HelpCenter);
  }
}
