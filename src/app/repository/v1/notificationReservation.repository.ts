import {NotificationsReservation} from '../../models/NotificationsReservation';
import {Repository} from '../generic';

import {ReservationOfficeRepository} from './reservationOffice.repository';
import {UsersRepository} from './users.repository';
import {OfficeRepository} from './office.repository';

const moment = require('moment');
// export
export class NotificationReservationRepository extends Repository {
  private reservationOfficeRepository: ReservationOfficeRepository = new ReservationOfficeRepository();
  private usersRepository: UsersRepository = new UsersRepository();
  private officeRepository: OfficeRepository = new OfficeRepository();

  listNotificationReservation = async (limit: number, offset: number) => {
    moment.locale('es');
    const notifications = await this.all({
      attributes: [
        ['id', 'notifReservationId'],
        'type',
        'reservationId',
        'message'
      ],
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    for (const notification of notifications) {
      const reservation = await this.reservationOfficeRepository.getReservationById(
        notification.dataValues.reservationId
      );
      reservation.dataValues.dateReservation = moment(
        reservation.dataValues.dateReservation
      )
        .format('MMMM D, YYYY')
        .toUpperCase();
      notification.dataValues.reservation = reservation;

      const officeData = await this.officeRepository.getBasicOfficeInfo(
        reservation.dataValues.officId
      );
      notification.dataValues.office = officeData;
    }

    return notifications;
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
    this.setModel(NotificationsReservation);
  }
}
