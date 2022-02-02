import {Repository} from '../generic';
import {ItemsCheckIn} from '../../models/ItemsCheckIn';
// export
export class ItemsCheckInRepository extends Repository {
  saveItemsCheckIn = async (itemsCheckIn: string) => {
    let arrayItems = itemsCheckIn.split(',');
    for (const officeItemId of arrayItems) {
      await this.create({
        checked: 1, // true
        officeItemId: officeItemId,
        status: 'active'
      });
    }
  };

  constructor() {
    super();
    this.setModel(ItemsCheckIn);
  }
}
