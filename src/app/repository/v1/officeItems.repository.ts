import {Repository} from '../generic';
import {OfficeItems} from '../../models/OfficeItems';
// export
export class OfficeItemsRepository extends Repository {
  saveItems = async (images: string, officeId: number, name: string) => {
    await this.create({
      image: images,
      name: name,
      officeId: officeId,
      status: 'active'
    });
  };
  updateItems = async (images: string, id: number, name: string) => {
    await this.update(
      {
        image: images,
        name: name
      },
      {id: id, status: 'active'}
    );
  };

  updateItemStatus = async (id: number) => {
    let data = await this.update(
      {
        status: 'inactive'
      },
      {
        id
      }
    );

    return data;
  };

  constructor() {
    super();
    this.setModel(OfficeItems);
  }
}
