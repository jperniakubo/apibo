import {Repository} from '../generic';
import {SystemPercentages} from '../../models/SystemPercentages';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class SystemPercentageRepository extends Repository {
  getAllPercentages = async () => {
    const allPercentages = await this.all({
      attributes: ['id', 'percent', 'percentText'],
      where: {
        status: 'active'
      }
    });

    return {allPercentages};
  };

  existsPercentage = async (id: number) => {
    const percentage = await this.one({where: {id}});
    return percentage !== null;
  };

  constructor() {
    super();
    this.setModel(SystemPercentages);
  }
}
