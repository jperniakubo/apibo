import {Repository} from '../generic';
import {SystemTimeAvailable} from '../../models/SystemTimeAvailable';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class SystemTimeAvailableRepository extends Repository {
  updateTimeAvailable = async (id: number, time: string) => {
    await this.update({time}, {id});
    const newTimeData = await this.one({where: {id}});

    return {
      success: true,
      message: 'Datos actualizados correctamente',
      positionData: newTimeData.dataValues
    };
  };

  getTimeById = async (id: number) => {
    const timeAvailable = await this.one({where: {id}});
    return timeAvailable;
  };

  constructor() {
    super();
    this.setModel(SystemTimeAvailable);
  }
}
