import {Repository} from '../generic';
import {OfficeArrivalsDirection} from '../../models/OfficeArrivalsDirection';
// export
export class OfficeArrivalsDirectionRepository extends Repository {
  saveInstructions = async (description: string, officeId: number) => {
    await this.create({
      description,
      officeId: officeId,
      status: 'active'
    });
  };
  updateInstructions = async (
    description: string,
    officeArrivalsDirectionId: number
  ) => {
    await this.update(
      {
        description,
        status: 'active'
      },
      {
        id: officeArrivalsDirectionId
      }
    );
  };
  changeStatusInstructions = async (officeArrivalsDirectionId: number) => {
    let data = await this.update(
      {
        status: 'inactive'
      },
      {
        id: officeArrivalsDirectionId
      }
    );

    return data;
  };

  findAll = async (limit: number, offset: number) => {
    const response = await this.all({
      where: {status: 'active'},
      limit: limit,
      offset: offset
    });

    return response;
  };

  findAllForOfficeId = async (
    officeId: number,
    limit: number,
    offset: number
  ) => {
    const response = await this.all({
      where: {status: 'active', officeId},
      limit: limit,
      offset: offset
    });

    return response;
  };

  constructor() {
    super();
    this.setModel(OfficeArrivalsDirection);
  }
}
