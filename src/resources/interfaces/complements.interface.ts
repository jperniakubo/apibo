import {Request} from 'express';

export interface MulterRequest extends Request {
  body: any;
  files: any;
}

export interface ID {
  id: number;
}

export interface LOG {
  logBoAdminId: number;
}

export interface CRUD {
  name: string;
}
export interface CrudLog {
  name: string;
  logBoAdminId: number;
}
export interface CRUDImage {
  name: string;
  slug: string;
}
export interface CRUDUpdate {
  id: number;
  name: string;
}
export interface CrudUpdateLog {
  id: number;
  name: string;
  logBoAdminId: number;
}
export interface CRUDUpdateTime {
  id: number;
  time: string;
  logBoAdminId: number;
}

export interface FILTER {
  filter: string;
  limit: number;
  offset: number;
  conditions?: object;
}

export interface BoAdminLogin {
  email: string;
  password: string;
}

export interface BoListUsers {
  needle: string;
  limit: number;
  offset: number;
}

export interface FilterOfficeByFloor {
  date: Date;
  startTime: string;
  endTime: string;
  cityId: number;
  buildingId: number;
  officeTypeId: number;
  floorBuildingId: number;
  limit: number;
  offset: number;
  uid: string;
}

export interface UsersFavoritesOffices {
  uid: string;
  limit: number;
  offset: number;
}

export interface AddOfficeToFavorites {
  uid: string;
  officeId: number;
}

export interface ReservationOffice {
  date: Date;
  startTime: string;
  endTime: string;
  uid: string;
  leadReservationUid: string;
  officeId: number;
}

export interface ListUserReservations {
  uid: string;
  limit: number;
  offset: number;
  filterReservation: number;
  filterDate: string;
}

export interface UpdateReservation {
  reservationId: number;
  date: Date;
  startTime: string;
  endTime: string;
  leadReservationUid: string;
  officeId: number;
}

export interface CheckQrOffice {
  officeId: number;
  code: string;
}

export interface SearchRecords {
  needle: string;
}

export interface SearchAdmins {
  needle: string;
  limit: number;
  offset: number;
}

export interface UserState {
  uid: string;
  active: number;
}

export interface UserUID {
  uid: string;
}

export interface UpdateAdmin {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: number;
  position: string;
  oldPassword: string;
  newPassword: string;
  roleAdminId: number;
}

export interface UpdateAdminLog {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: number;
  position: string;
  oldPassword: string;
  newPassword: string;
  roleAdminId: number;
  logBoAdminId: number;
}

export interface AdminState {
  id: number;
  active: number;
}
export interface AdminStateLog {
  id: number;
  active: number;
  logBoAdminId: number;
}

export interface CreateAdmin {
  fullName: string;
  password: string;
  email: string;
  position: string;
  roleAdminId: number;
  phoneNumber: number;
}

export interface CreateAdminLog {
  fullName: string;
  password: string;
  email: string;
  position: string;
  roleAdminId: number;
  phoneNumber: number;
  logBoAdminId: number;
}

export interface ListBoAdmins {
  needle: string;
  limit: number;
  offset: number;
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface listCities {
  needle: string;
  limit: number;
  offset: number;
}

export interface paginationWithNeedle {
  needle: string;
  limit: number;
  offset: number;
}
export interface qrCode {
  qrCode: string;
}
