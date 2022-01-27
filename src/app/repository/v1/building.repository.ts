import {Repository} from '../generic';
import {Building} from '../../models/Building';
import {FloorBuilding} from '../../models/FloorBuilding';
import {City} from '../../models/City';

const {Op, QueryTypes, Sequelize} = require('sequelize');

// export
export class BuildingRepository extends Repository {
  constructor() {
    super();
    this.setModel(Building);
  }

  getInfoBuildingById = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      attributes: [
        'id',
        'name',
        'description',
        'numberOfFloors',
        'status',
        'address',
        'comment',
        'lat',
        'long',
        'minReservationCreationTime',
        'minReservationCancellationTime',
        'cityId'
      ],
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    return buildingInfo.dataValues;
  };

  getInfoBuildingAndYourCity = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    return buildingInfo.dataValues;
  };

  getBuildingInfo = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      attributes: [['name', 'buildingName']],
      where: {
        id: buildingId,
        status: 'active'
      }
    });
    return buildingInfo.dataValues;
  };

  getBuilingNameById = async (buildingId: number) => {
    this.setModel(Building);
    const buildingInfo = await this.one({
      attributes: ['name'],
      where: {
        id: buildingId
      }
    });
    return buildingInfo.dataValues.name;
  };

  listBuildings = async (
    cityId: number,
    needle: string,
    limit: number,
    offset: number
  ) => {
    let whereObject: any;
    whereObject =
      cityId !== 0
        ? {cityId, name: {[Op.like]: '%' + needle + '%'}}
        : {name: {[Op.like]: '%' + needle + '%'}};

    const buildings = await this.all({
      attributes: ['id', 'name', 'address', 'numberOfFloors', 'status'],
      where: whereObject,
      limit,
      offset,
      include: [
        {
          model: City,
          attributes: ['name']
        }
      ]
    });

    const totalBuilding = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    return {buildings, total: totalBuilding.dataValues.totalRows};
  };

  existsBuilding = async (identifier: string | number) => {
    let whereObject: object;
    whereObject =
      typeof identifier === 'string'
        ? {where: {name: identifier}}
        : {where: {id: identifier}};

    const building = await this.one(whereObject);
    return building !== null;
  };

  existsNameBuilding = async (name: String, id: number) => {
    let whereObject: object;
    whereObject = {where: {name, id: {[Op.ne]: id}}};

    const building = await this.one(whereObject);
    return building !== null;
  };

  setBuildingStatus = async (active: number, id: number) => {
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

  updateBuilding = async (
    id: number,
    name: string,
    cityId: number,
    address: string,
    minReservationCreationTime: number,
    minReservationCancellationTime: number,
    latitude: string,
    longitude: string,
    floors: any,
    systemPercentageId: number
  ) => {
    const countFloors = floors.length;
    await this.update(
      {
        name,
        description: name,
        cityId,
        systemPercentageId,
        address,
        minReservationCreationTime,
        minReservationCancellationTime,
        lat: latitude,
        long: longitude,
        numberOfFloors: countFloors
      },
      {id}
    );
    const building = await this.one({
      where: {id}
    });

    building.dataValues.code = 100;
    return building;
  };

  createBuilding = async (
    name: string,
    cityId: number,
    address: string,
    minReservationCreationTime: number,
    minReservationCancellationTime: number,
    latitude: string,
    longitude: string,
    floors: any,
    systemPercentageId: number
  ) => {
    const countFloors = floors.length;

    await this.create({
      name,
      description: name,
      numberOfFloors: countFloors,
      address,
      comment: name,
      cityId,
      systemPercentageId,
      minReservationCreationTime,
      minReservationCancellationTime,
      lat: latitude,
      long: longitude,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newBuilding = await this.one({
      where: {
        name
      }
    });

    newBuilding.dataValues.code = 100;
    return newBuilding;
  };

  buildingById = async (id: number) => {
    const building = await this.one({
      where: {
        id
      },
      include: [
        {
          model: FloorBuilding,
          attributes: ['id', 'floor', 'status']
        }
      ]
    });

    return building;
  };
}
