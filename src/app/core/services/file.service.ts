import { Injectable } from '@angular/core';
import { API_URL } from '../constants/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private bioHttp: HttpService
  ) { }

  uploadFile(type: string, userId: number, file: File, companyId?: string, globalSponsorCompanyId?: any) {
    let url = API_URL.uploadFile + '?fileType=' + type;
    if (userId) {
      url = url + '&userId=' + userId;
    }
    if (companyId) {
      url = url + '&companyId=' +  companyId;
    }
    if (globalSponsorCompanyId) {
      url = url + '&globalSponsorCompanyId=' + globalSponsorCompanyId;
    }
    const formdata = new FormData();
    formdata.append('file', file);
    return this.bioHttp.postFormData(url, formdata);
  }

  getFile(url: string) {
    return this.bioHttp.getProfileImage(url);
  }
}
