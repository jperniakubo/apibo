import {Repository} from '../generic';
import {Positions} from '../../models/Positions';
import {Sequelize} from 'sequelize';

const {Op} = require('sequelize');

// export
export class PositionsRepository extends Repository {
  getAllPositions = async () => {
    const allPositions = await this.all({
      attributes: ['id', 'name', 'status'],
      where: {
        status: 'active'
      }
    });

    return {allPositions};
  };

  getPositions = async (needle: string, limit: number, offset: number) => {
    const positions = await this.all({
      where: {
        name: {[Op.like]: '%' + needle + '%'}
      },
      limit,
      offset
    });

    const totalPositions = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: {
        name: {[Op.like]: '%' + needle + '%'}
      }
    });

    return {positions, total: totalPositions.dataValues.totalRows};
  };

  createPosition = async (name: string) => {
    await this.create({name});

    const newPosition = await this.one({where: {name}});
    newPosition.dataValues.code = 100;

    return newPosition;
  };

  existsPosition = async (name: string) => {
    const position = await this.one({where: {name}});
    return position !== null;
  };

  updatePosition = async (id: number, name: string) => {
    if (await this.existsAnotherPosition(id, name))
      return {
        success: false,
        message: 'Existe otro cargo con el nuevo nombre ingresado'
      };

    await this.update({name}, {id});
    const newPositionData = await this.one({where: {id}});

    return {
      success: true,
      message: 'Datos actualizados correctamente',
      positionData: newPositionData.dataValues
    };
  };

  changePositionState = async (active: number, id: number) => {
    await this.update(
      {
        status: active === 1 ? 'active' : 'inactive'
      },
      {id}
    );
    return await this.one({
      where: {id}
    });
  };

  existsAnotherPosition = async (id: number, name: string) => {
    const position = await this.one({
      where: {
        [Op.and]: [{name}, {id: {[Op.ne]: id}}]
      }
    });
    return position !== null;
  };

  getPositionById = async (id: number) => {
    const position = await this.one({where: {id}});
    return position;
  };

  constructor() {
    super();
    this.setModel(Positions);
  }
}
