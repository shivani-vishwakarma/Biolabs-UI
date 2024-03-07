import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { ROLE } from 'src/app/shared/utility/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(
    private http: HttpService,
    private defaultData: DefaultDataService
  ) { }

  /**
   * @description Fetch Biolabs Sources for Appication Form
   * Description: Fetch Biolabs Sources for Appication Form
   */
  async getSiteList() {
    return await this.defaultData.getSiteList();
  }

  async getUserType() {
    return await this.defaultData.getUserType();
  }

  getUserList(type: string) {
    let query = '';
    switch (type) {
      case 'Admin':
        query = '?role=' + ROLE.SITE_ADMIN;
        break;
      case 'Sponsor':
        query = '?role=' + ROLE.SPONSOR;
        break;
      case 'Resident':
        query = '?role=' + ROLE.RESIDENT;
        break;
      case 'Accountant':
        query = '?role=' + ROLE.ACCOUNTANT;
        break;
      case 'Sponsor_Manager':
        query = '?role=' + ROLE.SPONSOR_MANAGER;
        break;
      case 'Business_Manager':
        query = '?role=' + ROLE.BUSINESS_MANAGER;
        break;
      case 'Resident_User':
        query = '?role=' + ROLE.RESIDENT_USER;
        break;
      default:
        query = '?role=' + ROLE.SITE_ADMIN;
        break;
    }
    return this.http.get(API_URL.useList + query, 0);
  }

  async addUser(body: object) {
    return await this.http.post(API_URL.addUser, body).toPromise();
  }
  async updateUser(body: object) {
    return await this.http.put(API_URL.addUser, body).toPromise();
  }
  async deleteUser(id: number) {
    return await this.http.delete(API_URL.addUser + '/' + id).toPromise();
  }

  async getUserById(id: number) {
    return await this.http.get(API_URL.useList + '/' + id, 0).toPromise();
  }
}

