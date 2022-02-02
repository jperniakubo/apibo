import {Repository} from '../generic';
import {OfficePlains} from '../../models/OfficePlains';
// export
export class OfficePlainsRepository extends Repository {
  saveImagesPlains = async (
    images: string,
    officeId: number,
    description: string
  ) => {
    await this.create({
      image: images,
      officeId: officeId,
      description: description,
      status: 'active'
    });
  };

  updateImagesPlains = async (
    images: string,
    officeId: number,
    description: string
  ) => {
    await this.update(
      {
        image: images,
        description: description
      },
      {officeId: officeId, status: 'active'}
    );
  };

  constructor() {
    super();
    this.setModel(OfficePlains);
  }
}
