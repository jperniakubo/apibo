import config from '../../../config';
import {BuildingRepository} from '../../repository/v1/building.repository';
import {FloorBuildingRepository} from '../../repository/v1/floorBuilding.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {IComplements, IBuilding} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class BuildingService {
  buildingRepository: BuildingRepository = new BuildingRepository();
  floorBuildingRepository: FloorBuildingRepository = new FloorBuildingRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  listBuildings = async (request: IBuilding.listBuildings) => {
    const data = await this.buildingRepository.listBuildings(
      request.cityId,
      request.needle,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  setBuildingStatus = async (request: IBuilding.setBuildingStatusLog) => {
    if (!(await this.buildingRepository.existsBuilding(request.id)))
      return generalServiceResponse(
        null,
        'El identificador del edificio es incorrecto'
      );

    const updateState = await this.buildingRepository.setBuildingStatus(
      request.active,
      request.id
    );
    if (updateState) {
      const action = `Ha modificado el edificio ${request.id} a estado ${
        request.active == 1 ? 'activo' : 'inactivo'
      }`;
      await this.logActionsRepository.saveLogAction(
        action,
        'building',
        request.id.toString(),
        request.logBoAdminId
      );
    }
    return generalServiceResponse(updateState);
  };

  createBuilding = async (request: IBuilding.CreateBuildingLog) => {
    if (await this.buildingRepository.existsBuilding(request.name))
      return generalServiceResponse(
        {code: 401},
        'Ya existe un edificio con el mismo nombre'
      );

    const data = await this.buildingRepository.createBuilding(
      request.name,
      request.cityId,
      request.address,
      request.minReservationCreationTime,
      request.minReservationCancellationTime,
      request.latitude,
      request.longitude,
      request.floors,
      request.systemPercentageId
    );
    request.floors.forEach(
      async (element: any) =>
        await this.floorBuildingRepository.createFloorsBuilding(
          element,
          data.dataValues.id
        )
    );
    if (data) {
      const action = `Ha creado el edificio ${data.dataValues.id} con nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'building',
        data.dataValues.id,
        request.logBoAdminId
      );
    }

    return generalServiceResponse(data, 'Operación exitosa');
  };

  updateBuilding = async (request: IBuilding.UpdateBuildingLog) => {
    if (
      await this.buildingRepository.existsNameBuilding(request.name, request.id)
    )
      return generalServiceResponse(
        {code: 401},
        'Ya existe un edificio con el mismo nombre'
      );

    const existBuilding = await this.buildingRepository.existsBuilding(
      request.id
    );
    if (!existBuilding) {
      return generalServiceResponse(
        {code: 401},
        'El identificador de este edificio no se encuentra'
      );
    }

    const data = await this.buildingRepository.updateBuilding(
      request.id,
      request.name,
      request.cityId,
      request.address,
      request.minReservationCreationTime,
      request.minReservationCancellationTime,
      request.latitude,
      request.longitude,
      request.floorsSave,
      request.systemPercentageId
    );

    request.floorsSave.forEach(async (element: any) => {
      if (element.id === 0) {
        await this.floorBuildingRepository.createFloorsBuilding(
          element.floor,
          data.dataValues.id
        );
      }
    });

    request.floorsDelete.forEach(async (element: any) => {
      if (element.id !== 0) {
        await this.floorBuildingRepository.deleteFloorsBuilding(element.id);
      }
    });
    if (data) {
      const action = `Ha modificado el edificio ${request.id} con nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'building',
        request.id.toString(),
        request.logBoAdminId
      );
    }

    return generalServiceResponse(data, 'Operación exitosa');
  };

  buildingById = async (request: IBuilding.BuildingById) => {
    const data = await this.buildingRepository.buildingById(request.id);
    return generalServiceResponse(data);
  };
}
