import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {

  constructor(private http: HttpService) { }

  getDashboardCompanyData() {
    const url = API_URL.sponsorGlobalData;
    return this.http.get(url);
  }

  getDashboardCompanyDataBySite() {
    const url = API_URL.sponsorSiteData;
    return this.http.get(url);
  }

  sitesWithoutFilter(): Observable<any> {
    return this.http.get(API_URL.siteList);
  }
}
