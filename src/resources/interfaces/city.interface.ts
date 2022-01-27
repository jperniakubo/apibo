export interface setCityStatus {
  id: number;
  active: number;
}

export interface CreateCity {
  name: string;
}

export interface UpdateCity {
  id: number;
  name: string;
}

export interface CreateCityLog {
  name: string;
  logBoAdminId: number;
}

export interface UpdateCityLog {
  id: number;
  name: string;
  logBoAdminId: number;
}

export interface setCityStatusLog {
  id: number;
  active: number;
  logBoAdminId: number;
}

export interface CityById {
  id: number;
}
