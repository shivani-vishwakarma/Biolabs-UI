import { Injectable } from '@angular/core';
import { HttpService } from '../rest/http.service';
import { API_URL } from '../constants/api-url';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Injectable({
    providedIn: 'root'
})

export class PrivacyService {
    constructor(private http: HttpService) { }
    async getPrivacyCompanyById(companyId: number) {
        return this.http.get(API_URL.getPrivacyData + '/' + companyId);
    }
    async updatePrivacyDataById(privacyId: number, data: any) {
      return this.http.put(API_URL.updatePrivacyData + '/' + privacyId, data);
    }

    getRole() {
        return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
      }

  checkPermission(privacy: string, data: any) {
    if (data && data[privacy] && this.getRole() == 3) {
      return true;
    }
    return (this.getRole() != 3) ? true : false;
  }

}
