import {Repository} from '../generic';
import {OfficeImages} from '../../models/OfficeImages';
// export
export class OfficeImagesRepository extends Repository {
  saveImages = async (
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

  updateImages = async (
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
    this.setModel(OfficeImages);
  }
}
