import {Repository} from '../generic';
import {LogActions} from '../../models/LogActions';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');
// const moment = require('moment');
const moment = require('moment-timezone');

// export
export class LogActionsRepository extends Repository {
  saveLogAction = async (
    action: string,
    table: string,
    rowId: string,
    boAdminId: number
  ) => {
    const onlyDate = await moment(new Date())
      .tz('America/Bogota')
      .format('YYYY-MM-DD');
    const onlyHour = await moment(new Date())
      .tz('America/Bogota')
      .format('HH:mm:ss');
    const todayDate = new Date(`${onlyDate}T${onlyHour}.000Z`);

    await this.create({
      action,
      table,
      rowId,
      boAdminId,
      status: 'active',
      createdAt: todayDate,
      updatedAt: todayDate
    });
  };

  constructor() {
    super();
    this.setModel(LogActions);
  }
}
