import {Repository} from '../generic';
import {SystemOfficeItems} from '../../models/SystemOfficeItems';
// export
export class SystemOfficeItemsRepository extends Repository {
  getAllSystemOfficeItems = async () => {
    const response = await this.all({
      attributes: ['id', 'name'],
      where: {
        status: 'active'
      },
      order: [['name', 'ASC']]
    });

    return response;
  };

  constructor() {
    super();
    this.setModel(SystemOfficeItems);
  }
}
