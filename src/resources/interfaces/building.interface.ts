export interface listBuildings {
  cityId: number;
  needle: string;
  limit: number;
  offset: number;
}

export interface setBuildingStatus {
  id: number;
  active: number;
}
export interface setBuildingStatusLog {
  id: number;
  active: number;
  logBoAdminId: number;
}

export interface CreateBuilding {
  name: string;
  cityId: number;
  address: string;
  minReservationCreationTime: number;
  minReservationCancellationTime: number;
  latitude: string;
  longitude: string;
  floors: any;
  systemPercentageId: number;
}

export interface CreateBuildingLog {
  name: string;
  cityId: number;
  address: string;
  minReservationCreationTime: number;
  minReservationCancellationTime: number;
  latitude: string;
  longitude: string;
  floors: any;
  systemPercentageId: number;
  logBoAdminId: number;
}

export interface UpdateBuilding {
  id: number;
  name: string;
  cityId: number;
  address: string;
  minReservationCreationTime: number;
  minReservationCancellationTime: number;
  latitude: string;
  longitude: string;
  floorsSave: any;
  floorsDelete: any;
  systemPercentageId: number;
}

export interface UpdateBuildingLog {
  id: number;
  name: string;
  cityId: number;
  address: string;
  minReservationCreationTime: number;
  minReservationCancellationTime: number;
  latitude: string;
  longitude: string;
  floorsSave: any;
  floorsDelete: any;
  systemPercentageId: number;
  logBoAdminId: number;
}

export interface BuildingById {
  id: number;
}
