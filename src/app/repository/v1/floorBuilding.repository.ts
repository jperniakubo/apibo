import {Repository} from '../generic';
import {FloorBuilding} from '../../models/FloorBuilding';
import {ConstantsManager} from '../../constants/constantsManager';
import {Op, Sequelize} from 'sequelize';
// export
export class FloorBuildingRepository extends Repository {
  getIinfoFloorById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuilding.dataValues;
  };

  getFloorInfoById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      attributes: [['floor', 'floorName']],
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuilding.dataValues;
  };

  getIFloorInfoById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      attributes: ['id', 'floor', 'status'],
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuilding.dataValues;
  };

  getFloorBuildingNameById = async (floorBuildingId: number) => {
    const floorBuilding = await this.one({
      attributes: ['floor'],
      where: {
        id: floorBuildingId
      }
    });
    return floorBuilding.dataValues.floor;
  };

  createFloorsBuilding = async (floor: string, buildingId: number) => {
    await this.create({
      floor,
      buildingId,
      status: 'active',
      createdAt: new Date()
    });

    const newBuilding = await this.one({
      where: {
        floor,
        buildingId
      }
    });

    newBuilding.dataValues.code = 100;
    return newBuilding;
  };

  deleteFloorsBuilding = async (id: number) => {
    await this.destroy({id});

    return id;
  };

  getFloorBuildingInfo = async (floorBuildingId: number) => {
    this.setModel(FloorBuilding);
    const floorBuildingInfo = await this.one({
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuildingInfo.dataValues;
  };

  getFloorBuildingById = async (floorBuildingId: number) => {
    this.setModel(FloorBuilding);
    const floorBuildingInfo = await this.one({
      attributes: ['id', 'name', 'description', 'image'],
      where: {
        id: floorBuildingId,
        status: 'active'
      }
    });
    return floorBuildingInfo.dataValues;
  };

  getAll = async (limit: number, offset: number) => {
    const response = await this.all();
    return response;
  };

  getAllFloorByBuildingId = async (buildingId: number) => {
    const response = await this.all({
      where: {buildingId}
    });
    return response;
  };

  filter = async (name: string) => {
    const response = await this.all({
      where: {floor: {[Op.substring]: name}}
    });

    return response;
  };

  getAllFilter = async (name: string, limit: number, offset: number) => {
    let whereObject: any = {};
    if (name) {
      whereObject['name'] = {[Op.substring]: name};
    }
    const floorBuildings = await this.all({
      where: whereObject,
      limit,
      offset
    });

    const totalOffice = await this.one({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRows']],
      where: whereObject
    });

    return {floorBuildings, totalrows: totalOffice.dataValues.totalRows};
  };

  getOne = async (id: number) => {
    const officeInfo = await this.one({
      where: {
        id
      }
    });

    return officeInfo;
  };

  getAllPage = async (limit: number, offset: number) => {
    const response = await this.all({
      limit: limit,
      offset: offset
    });
    const constantsManager = new ConstantsManager().getUrlBuildingImages();
    for (let index = 0; index < response.length; index++) {
      const floorBuilding = response[index].dataValues;
      floorBuilding.image = String(constantsManager) + floorBuilding.image;
    }
    return response;
  };

  createOffice = async (request: any) => {
    const response = await this.create(request);

    return response;
  };

  updateStatus = async (id: number, status: string) => {
    const officeInfo = await this.update({status}, {id});

    return officeInfo;
  };

  updateFloorBuilding = async (req: string, id: number) => {
    const officeInfo = await this.update(req, {id});

    return officeInfo;
  };

  constructor() {
    super();
    this.setModel(FloorBuilding);
  }
}
