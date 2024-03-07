import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class GrowthService {
  url = API_URL.residentCompany;

  constructor(private http: HttpService) { }

  /**
   * @description Gives Company By Application Id.
   * Description Gives Company By Application Id.
   * @param applicationId Applicaton Id.
   */
  getCompanyById(applicationId: number): Observable<any> {
    return this.http.get(`${this.url}/${applicationId}`);
  }

  /**
   * @description Gives Stage Of Technology  Site Id.
   * Description Gives Stage Of Technology  Site Id.
   * @param siteId Site Id.
   * @param companyId companyId.
   */
  stageOfTechnology(siteId: number, companyId: number): Observable<any> {
    return this.http.get(`${this.url}/stage-technology/${siteId}/${companyId}`);
  }

  /**
   * @description Gives Funding of Application by  Site Id and Company Id.
   * Description Gives Funding of Application by  Site Id and Company Id.
   * @param siteId SiteId.
   * @param companyId companyId.
   */
  funding(siteId: number, companyId: number) {
    return this.http.get(`${this.url}/funding/${siteId}/${companyId}`);
  }

  /**
   * @description Gives started with biolabs(date with BioLabs).
   * Description Gives started with biolabs(date with BioLabs).
   * @param siteId SiteId.
   * @param companyId companyId.
   */
   getStartedWithBiolabs(siteId: number, companyId: number) {
    return this.http.get(`${this.url}/startedWithBiolabs/${siteId}/${companyId}`);
  }

  /**
   * @description Returns the feeds
   * Description Returns the feeds
   * @param companyId Company Id.
   * @param siteId SiteId.
   */
  getFeeds(siteId: number, companyId: number) {
    return this.http.get(`${this.url}/feeds/${siteId}/${companyId}`);
  }

  /**
   * @description Gives current month fee details
   * Description Gives current month fee details
   * @param companyId Company Id.
   */
  getFinancialFees(companyId: number) {
    return this.http.get(`${this.url}/financialfees/${companyId}`);
  }

  /**
   * @description Gets data to visualize timeline data on graph.
   * Description Gets data to visualize timeline data on graph.
   * @param companyId Company Id.
   */
  getTimelineAnalysis(companyId: number) {
    return this.http.get(`${this.url}/timeline/analysis/${companyId}`);
  }

  /**
   * @description Gets comapny size  to visualize timeline data on graph.
   * Description Gets comapny size to visualize timeline data on graph.
   * @param companyId Company Id.
   */
  getCompanySizeAnalysis(companyId: number) {
    return this.http.get(`${this.url}/companysizeanalysis/${companyId}`);
  }
}
