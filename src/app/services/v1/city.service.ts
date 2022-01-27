import config from '../../../config';
import {CityRepository} from '../../repository/v1/city.repository';
import {LogActionsRepository} from '../../repository/v1/logActions.repository';
import {IComplements, ICity} from '../../../resources/interfaces';
import {generalServiceResponse} from '../../../utils/GeneralHelpers';
// Language
const language = `../../../resources/lang/${config.LANGUAGE}`;
const lang = require(language);

export class CityService {
  cityRepository: CityRepository = new CityRepository();
  private logActionsRepository: LogActionsRepository = new LogActionsRepository();

  all = async (request: IComplements.Pagination) => {
    const data = await this.cityRepository.allActive(
      request.limit,
      request.offset
    );
    // Check if Exist
    if (typeof data === 'undefined' || !data || data === null) {
      return {
        status: false,
        message: lang.STACK.CRUD.ERROR.EMPTY
      };
    }

    return {
      status: true,
      data,
      message: lang.STACK.CRUD.SUCCESS
    };
  };

  listCities = async (request: IComplements.listCities) => {
    const data = await this.cityRepository.listCities(
      request.needle,
      request.limit,
      request.offset
    );
    return generalServiceResponse(data);
  };

  setCityStatus = async (request: ICity.setCityStatusLog) => {
    if (!(await this.cityRepository.existsCity(request.id)))
      return generalServiceResponse(
        null,
        'El identificador de la ciudad es incorrecta'
      );

    const updateState = await this.cityRepository.setCityStatus(
      request.active,
      request.id
    );
    if (updateState) {
      const action = `Ha modificado la ciudad ${request.id} a estado ${
        request.active == 1 ? 'activo' : 'inactivo'
      }`;
      await this.logActionsRepository.saveLogAction(
        action,
        'city',
        request.id.toString(),
        request.logBoAdminId
      );
    }
    return generalServiceResponse(updateState);
  };

  createCity = async (request: ICity.CreateCityLog) => {
    if (await this.cityRepository.existsCity(request.name))
      return generalServiceResponse(
        {code: 401},
        'Ya existe una ciudad con el mismo nombre'
      );

    const data = await this.cityRepository.createCity(request.name);
    if (data) {
      const action = `Ha creado la ciudad ${data.dataValues.id} con nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'city',
        data.dataValues.id,
        request.logBoAdminId
      );
    }
    return generalServiceResponse(data, 'Operación exitosa');
  };

  updateCity = async (request: ICity.UpdateCityLog) => {
    if (!(await this.cityRepository.existsCity(request.id)))
      return generalServiceResponse(
        null,
        'El identificador de la ciudad es incorrecta'
      );

    const resultUpdate: any = await this.cityRepository.updateCity(
      request.id,
      request.name
    );
    if (resultUpdate.success) {
      const action = `Ha modificado la ciudad ${request.id} con nombre: ${request.name}`;
      await this.logActionsRepository.saveLogAction(
        action,
        'city',
        request.id.toString(),
        request.logBoAdminId
      );
      return generalServiceResponse(resultUpdate.cityData, 'Operación exitosa');
    }

    return generalServiceResponse(null, resultUpdate.message);
  };

  cityById = async (request: ICity.CityById) => {
    const data = await this.cityRepository.cityById(request.id);
    return generalServiceResponse(data);
  };
}
