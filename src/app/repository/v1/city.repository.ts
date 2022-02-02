import {Repository} from '../generic';
import {City} from '../../models/City';

const {Op, QueryTypes, Sequelize} = require('sequelize');
// export
export class CityRepository extends Repository {
  allActive = async (limit: number, offset: number) => {
    const response = await this.all({
      where: {status: 'active'},
      limit: limit,
      offset: offset
    });
    return response;
  };

  constructor() {
    super();
    this.setModel(City);
  }

  listCities = async (needle: string, limit: number, offset: number) => {
    //console.log('el needle es', needle);
    const cities = await this.all({
      attributes: ['id', 'name', 'description', 'status'],
      where: {
        name: {[Op.like]: '%' + needle + '%'}
      },
      limit, // by default,
      offset
    });

    const totalCities = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: {
        name: {[Op.like]: '%' + needle + '%'}
      }
    });

    return {cities, total: totalCities.dataValues.totalRows};
  };

  existsCity = async (identifier: string | number) => {
    let whereObject: object;
    whereObject =
      typeof identifier === 'string'
        ? {where: {name: identifier}}
        : {where: {id: identifier}};

    const city = await this.one(whereObject);
    return city !== null;
  };

  setCityStatus = async (active: number, id: number) => {
    await this.update(
      {
        status: active === 1 ? 'active' : 'inactive'
      },
      {id}
    );
    return await this.one({
      where: {id: id}
    });
  };

  createCity = async (name: string) => {
    await this.create({
      name,
      description: name,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const newCity = await this.one({
      where: {
        name
      }
    });
    newCity.dataValues.code = 100;
    return newCity;
  };

  updateCity = async (id: number, name: string) => {
    if (await this.existsAnotherCityWithSameName(id, name))
      return {
        success: false,
        message: 'Existe otra ciudad con el nuevo nombre ingresado'
      };

    let cityDataToUpdate: any = {
      name,
      description: name
    };

    await this.update(cityDataToUpdate, {id});
    const newCityData = await this.one({
      where: {
        id
      }
    });

    return {
      success: true,
      message: 'Datos actualizados correctamente',
      cityData: newCityData.dataValues
    };
  };

  existsAnotherCityWithSameName = async (id: number, name: string) => {
    const city = await this.one({
      where: {
        [Op.and]: [{name}, {id: {[Op.ne]: id}}]
      }
    });
    return city !== null;
  };

  cityById = async (id: number) => {
    const city = await this.one({
      where: {
        id
      }
    });

    return city;
  };
}
