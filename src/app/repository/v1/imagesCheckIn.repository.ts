import {Repository} from '../generic';
import {ImagesCheckIn} from '../../models/ImagesCheckIn';
// export
export class ImagesCheckInRepository extends Repository {
  saveImages = async (images: string[], checkInId: number) => {
    for (const img of images) {
      await this.create({
        image: img,
        checkInId: checkInId,
        status: 'active'
      });
    }
  };

  constructor() {
    super();
    this.setModel(ImagesCheckIn);
  }
}
