import {Repository} from '../generic';
import {CheckOut} from '../../models/CheckOut';
// Repositories
import {ItemsCheckOutRepository} from '../../repository/v1/itemsCheckout.repository';
import {ImagesCheckOutRepository} from '../../repository/v1/imagesCheckout.repository';
import {ReservationOfficeRepository} from '../../repository/v1/reservationOffice.repository';

export class CheckOutRepository extends Repository {
  private imagesCheckOutRepository = new ImagesCheckOutRepository();
  private itemsCheckOutRepository = new ItemsCheckOutRepository();
  private reservationOfficeRepository = new ReservationOfficeRepository();

  constructor() {
    super();
    this.setModel(CheckOut);
  }

  makeCheckOut = async (
    reservationId: number,
    comment: string,
    itemsCheckOut: string,
    officeId: number,
    amountOfPeople: number,
    images: string[]
  ) => {
    // save checkout, images and items
    await this.create({
      comment: comment,
      reservationId: reservationId,
      officeId: officeId,
      amountOfPeople: amountOfPeople,
      status: 'active'
    });
    const lastInsert = await this.one({
      where: {
        comment: comment,
        reservationId: reservationId,
        officeId: officeId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });
    // change reservation to 'used' status
    this.reservationOfficeRepository.changeReservationState(
      lastInsert.get('id'),
      'used'
    );
    await this.imagesCheckOutRepository.saveImagesCheckOut(
      images,
      lastInsert.get('id')
    );
    if (itemsCheckOut.length === 0) return {success: true};

    await this.itemsCheckOutRepository.saveItemsCheckout(
      itemsCheckOut,
      lastInsert.get('id')
    );
    return {success: true};
  };

  checkOutIsDone = async (reservationId: number, officeId: number) => {
    this.setModel(CheckOut); // no neccesary
    const checkOut = await this.one({
      where: {
        reservationId: reservationId,
        officeId: officeId,
        status: 'active'
      }
    });
    return checkOut !== null;
  };
}
