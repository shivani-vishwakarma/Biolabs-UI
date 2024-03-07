import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalSponsorService {

  constructor(private http: HttpService) { }

  getGlobalSponsors() {
    const url = API_URL.globalSponsor;
    return this.http.get(url);
  }

  getGlobalSiteSponsors(siteId: any) {
    const url = API_URL.globalSponsor;
    return this.http.get(`${url}/directory/${siteId}`);
  }

  getGlobalSponsorCompanyById(applicationId: number) {
    const url = API_URL.globalSponsor;
    return this.http.get(url + '/' + applicationId);
  }

  addGlobalSponsor(globalSponsorData: any) {
    const url = API_URL.globalSponsor;
    return this.http.post(url, globalSponsorData);
  }

  deleteGlobalSponsor(id: any) {
    const url = API_URL.globalSponsor;
    return this.http.delete(`${url}/${id}`);
  }

  sendConnectRequest(connectRequestData: any){
    const url = API_URL.globalSponsor;
    return this.http.post(`${url}/connect`, connectRequestData);
  }
}
