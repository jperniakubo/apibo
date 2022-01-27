import {Op} from 'sequelize';

import {Repository} from '../generic';
import {LogPwdAdmin} from '../../models/LogPwdAdmin';
import {IComplements, ILogPwdAdmin} from '../../../resources/interfaces';
// export
export class LogPwdAdminRepository extends Repository {
  createNewLogPwdAdmin = async (boAdminId: number) => {
    const dateToday = new Date();
    const todayDate = this.getTodayDate(dateToday);
    await this.create({
      date: todayDate,
      boAdminId: boAdminId
    });
    const newLog = await this.one({
      where: {
        boAdminId: boAdminId
      }
    });
    return newLog;
  };

  updateLogPwdByAdminId = async (boAdminId: number) => {
    const dateToday = new Date();
    const todayDate = this.getTodayDate(dateToday);

    const oldData = await this.one({where: {boAdminId: boAdminId}});
    const logId = oldData.dataValues.id;

    await this.update({date: todayDate}, {id: logId});
    const newLogData = await this.one({where: {boAdminId: boAdminId}});

    return newLogData;
  };

  getExchangeDate = async (boAdminId: number) => {
    console.log('kkk', boAdminId);
    const logPwdAdmin = await this.one({where: {id: boAdminId}});
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() - 60); //date 60 days ago
    const dateDaysAgo = this.getTodayDate(dateToday);
    if (!logPwdAdmin) return true;
    return dateDaysAgo >= logPwdAdmin.dataValues.date;
  };

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

  constructor() {
    super();
    this.setModel(LogPwdAdmin);
  }
}
