export class ConstantsManager {
  // base url to development environment
  // readonly BASE_URL = 'http://kpmgboapi.inkubo.co:50002/';
  //readonly BASE_URL_API = 'http://kpmgapi.inkubo.co:5005/';
  // base url to production environment
  //readonly BASE_URL = 'https://boapionekey.co.kworld.kpmg.com:5001/';
  //readonly BASE_URL_API = 'https://apionekey.co.kworld.kpmg.com:5000/';
  readonly BASE_URL = 'https://www.kpmgexternalservices.com.co:5001/';
  readonly BASE_URL_API = 'https://www.kpmgexternalservices.com.co:5001/';

  constructor() {
    // ....
  }

  getBaseUrl() {
    return this.BASE_URL;
  }

  getBaseUrlApiApp() {
    return this.BASE_URL_API;
  }

  getUrlBuildingImages(): string {
    return this.BASE_URL + 'buildingImages/';
  }

  getUrlOfficeTypeImages(): string {
    return this.BASE_URL + 'officeType/';
  }

  getUrlBoAdminAvatar(): string {
    return this.BASE_URL + 'boAdminImages/';
  }

  getUrlCheckInImages(): string {
    return this.BASE_URL + 'checkInImages/';
  }

  getUrlCheckOutImages(): string {
    return this.BASE_URL + 'checkOutImages/';
  }

  getUrlOfficeImages(): string {
    return this.BASE_URL + 'officeImages/';
  }

  getUrlOfficePlains(): string {
    return this.BASE_URL + 'officePlains/';
  }

  getUrlUserImages(): string {
    return this.BASE_URL_API + 'users/';
  }
}
