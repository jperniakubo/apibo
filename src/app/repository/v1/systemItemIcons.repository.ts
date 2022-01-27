import {Repository} from '../generic';
import {SystemItemIcons} from '../../models/SystemItemIcons';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class SystemItemIconsRepository extends Repository {
  getAllSystemIcons = async () => {
    const allIcons = await this.all({
      attributes: ['id', 'svg', 'png'],
      where: {
        status: 'active'
      }
    });

    return {allIcons};
  };

  constructor() {
    super();
    this.setModel(SystemItemIcons);
  }
}
