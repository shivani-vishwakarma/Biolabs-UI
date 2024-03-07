import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(private http: HttpService) {

   }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getMetrics(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.metrics;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBusinessMetrics(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsTotalOccupancyByRevenue(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/totalOcupancyByRevenue/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsCompanySize(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/companySize/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsNoOfMembersAndFundRaisedSum(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/numberOfMemberandSumOfFundRaised/${startDate}/${endDate}`);
  }
  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsCurrentandgraduatecompanies(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/currentandgraduatecompanies/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsTotalRevenueByType(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/totalrevenuebytype/${startDate}/${endDate}`);
  }
  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsTotalPercentageByType(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/percentageoccupancybytype/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsCompanyTypesAndFundRaised(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/companytypesandfundraised/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getBiolabsAvgData(startDate: any, endDate: any) {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/avgData/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getSiteDemographics(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.siteDemographics;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getOccupanybyRevenueAndPercentage(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.occupanybyRevenueAndPercentage;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getOccupanybyRevenueAndPercentagebytype(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.occupanybyRevenueAndPercentagebytype;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getCompanySize(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.companySize;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getCompanyTypes(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.companyTypes;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
    getNumberOfMemberandSumOfFundRaised(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.numberOfMemberandSumOfFundRaised;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
    getCurrentandgraduatecompanies(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.currentandgraduatecompanies;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
    getAverageData(siteId: any, startDate: any, endDate: any) {
    const apiUrl = API_URL.avgData;
    return this.http.get(`${apiUrl}/${siteId}/${startDate}/${endDate}`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
    getSiteConfigData(siteId: any) {
    const apiUrl = API_URL.siteConfig;
    return this.http.get(`${apiUrl}/${siteId}`);
  }

  isTypeSiteSelected(key: any) {
    const siteSelected = key === 'site' ? true : false;
    return siteSelected;
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getWorldWideStandardPrice() {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/worldwide-standardprice`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getWorldWideSummary() {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/worldwide-summary`);
  }

  /**
   * Description : This method is used to  get metrics data.
   * @description :This method is used to  get metrics data.
   */
  getWorldWideTotal() {
    const apiUrl = API_URL.businessMetrics;
    return this.http.get(`${apiUrl}/worldwide-total`);
  }
}
