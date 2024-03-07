import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../rest/http.service';
import { API_URL } from '../constants/api-url';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  constructor(private http: HttpService) { }

  /**
   * Description : This method is used to submit form data.
   * @description :This method is used to submit form data.
   * @param value : Form data
   */
  async submitResidentForm(value: any) {
    value.startDate = new Date(value.startDate).getTime() / 1000;
    const url = API_URL.residentCompany;
    return await this.http.post(url, value).toPromise();
  }

  /**
   * @description : This method is used to update company information.
   * Description : This method is used to Update company information.
   * @param value Form values
   */
  async updateResidentForm(value: any) {
    value.startDate = new Date(value.startDate).getTime() / 1000;
    const url = API_URL.residentCompany;
    return await this.http.put(url, value).toPromise();
  }

  /**
   * @description : This method is used to get list of company applications
   * Description : This method is used to get list of company applications
   */
  getCompanies(param?: any) {
    let params = '';
    const cs = 'companyStatus';
    const cv = 'companyVisibility';
    const cos = 'companyOnboardingStatus';
    const committeS = 'committeeStatus';
    const sortBy = 'sortBy';

    const param1 = param[cs] && param[cs] != '' ? 'companyStatus=' + param[cs] : '';
    const param2 = (typeof param[cv] !== 'undefined' && param[cv] !== '') ? 'companyVisibility=' + param[cv] : '';
    const param3 = (typeof param[cos] !== 'undefined' && param[cos] !== '') ? 'companyOnboardingStatus=' + param[cos] : '';
    const param4 = (typeof param[committeS] !== 'undefined' && param[committeS] !== '') ? 'committeeStatus=' + param[committeS] : '';
    const param5 = (typeof param[sortBy] !== 'undefined' && param[sortBy] !== '') ? 'sortBy=' + param[sortBy] : '';

    if (param1 != '') {
      params += (params == '') ? '?' + param1 : '&' + param1;
    }
    if (param2 != '') {
      params += (params == '') ? '?' + param2 : '&' + param2;
    }
    if (param3 != '') {
      params += (params == '') ? '?' + param3 : '&' + param3;
    }
    if (param4 != '') {
      params += (params == '') ? '?' + param4 : '&' + param4;
    }
    if (param5 != '') {
      params += (params == '') ? '?' + param5 : '&' + param5;
    }

    const url = API_URL.residentCompany + params;
    return this.http.get(url);
  }

  /**
   * @description : This method is used to get list of company applications
   * Description : This method is used to get list of company applications
   */
   getResidentCompanies(param?: any) {
    let params = '';
    const cs = 'companyStatus';
    const cv = 'companyVisibility';
    const cos = 'companyOnboardingStatus';
    const committeS = 'committeeStatus';
    const sortBy = 'sortBy';

    const param1 = param[cs] && param[cs] != '' ? 'companyStatus=' + param[cs] : '';
    const param2 = (typeof param[cv] !== 'undefined' && param[cv] !== '') ? 'companyVisibility=' + param[cv] : '';
    const param3 = (typeof param[cos] !== 'undefined' && param[cos] !== '') ? 'companyOnboardingStatus=' + param[cos] : '';
    const param4 = (typeof param[committeS] !== 'undefined' && param[committeS] !== '') ? 'committeeStatus=' + param[committeS] : '';
    const param5 = (typeof param[sortBy] !== 'undefined' && param[sortBy] !== '') ? 'sortBy=' + param[sortBy] : '';

    if (param1 != '') {
      params += (params == '') ? '?' + param1 : '&' + param1;
    }
    if (param2 != '') {
      params += (params == '') ? '?' + param2 : '&' + param2;
    }
    if (param3 != '') {
      params += (params == '') ? '?' + param3 : '&' + param3;
    }
    if (param4 != '') {
      params += (params == '') ? '?' + param4 : '&' + param4;
    }
    if (param5 != '') {
      params += (params == '') ? '?' + param5 : '&' + param5;
    }

    const url = API_URL.companyTab + params;
    return this.http.get(url);
  }

  /**
   * @description :This method is used to get company application by application id.
   * Description : This method is used to get company application by application id.
   * @param applicationId application Id
   */
  getCompanyById(applicationId: number) {
    const url = API_URL.residentCompany;
    return this.http.get(url + '/' + applicationId);
  }

  /**
   * @description : This method is used to update company status(application status).
   * Description : This method is used to update company status(application status).
   * @param body ApplicationStatus Payload
   */
  async updateCompStatus(body: object) {
    const url = API_URL.companyStatusUpdate;
    return this.http.put(url, body);
  }

  /**
   * @description : This method is used to forward application to selected site.
   * Description : his method is used to forward application to selected site.
   * @param companyId Id of company
   * @param siteId selected site id
   */
  async forwardApplication(companyId: any, siteId: any) {
    const url = `${API_URL.forwardApp}/${companyId}/${siteId}`;
    return this.http.post(url);
  }

  /**
   * @description :This method is used to  Search Company
   * Description : This method is used to Search Company
   * @param body search Payload
   */
  searchCompany(param: SearchResidentCompanyPayload) {
    const url = this.appendKeyIntoUrl(API_URL.searchCompany, param);
    return this.http.get(`${url} + companyVisibility=true}`);
  }

  appendKeyIntoUrl(url: string, paramObj: any) {
    url += '?';
    for (const key in paramObj) {
      if (paramObj[key] && typeof paramObj[key] == 'object') {
        for (const id of paramObj[key]) {
          url += key + '=' + id + '&';
        }
      }
      else if (paramObj[key] && paramObj[key].toString().length > 0) {
        url += key + '=' + paramObj[key] + '&';
      }
    }
    return url;
  }

  /**
   * @description : This method is used to add Notes.
   * Description :This method is used to add Notes.
   * @param value Form values
   */
  async addNotes(value: any) {
    const url = API_URL.notes;
    return await this.http.post(url, value).toPromise();
  }

  /**
   * @description :This method is used to get notes by company Id.
   * Description : This method is used to get notes by company Id.
   * @param companyId This is company Id.
   */
  async getNotesByCompanyId(companyId: number) {
    const url = API_URL.notes;
    return await this.http.get(`${url}/${companyId}`).toPromise();
  }

  /**
   * @description : This method is used to delete notes by company Id.
   * Description : This method is used to delete notes by company Id.
   * @param noteId This is note Id.
   */
  async deleteNoteByNoteId(noteId: number) {
    const url = API_URL.notes;
    return await this.http.delete(`${url}/${noteId}`).toPromise();
  }

  /**
   * Description : This method is used to delete member by member Id.
   * @description : This method is used to delete member by member Id.
   * @param memberId this is member Id.
   * @param type this is type of member
   */
  deleteMemberById(memberId: number, type: string) {
    const url = API_URL.member;
    return this.http.delete(`${url}/${memberId}/${type}`);
  }

  /**
   * Description :This method is used to get items for space change waitlist object by companyId.
   * @description : This method is used to get items for space change waitlist object by companyId.
   * @param companyId this is company Id
   */
  getSpaceChangeWaitListItems(companyId: number) {
    const url = API_URL.changeListItems + '/' + companyId;
    return this.http.get(url);
  }

  /**
   * Description :This method is used to get change waitlist object by status.
   * @description :This method is used to get change waitlist object by status.
   * @param status this is Status array.
   */
  getSpaceChangeWaitListByStatus(status: number[]) {
    let statusparams = '';
    for (const itearatestatus in status) {
      if (itearatestatus == '0') {
        statusparams += `status=${status[itearatestatus]}`;
      } else {
        statusparams += `&status=${status[itearatestatus]}`;
      }
    }
    const url = API_URL.getSpaceChangeWaitlist + statusparams;
    return this.http.get(url);
  }

  /**
   * Description :This method is used to get Company details by company id.
   * @description :This method is used to get Company details by company id.
   * @param companyId this is Company id.
   */
  getDetailsOfResidentCompanyByCompanyId(companyId: number) {
    return this.http.get(API_URL.getCompanyDetailsByCompanyId + '/' + companyId);
  }

  /**
   * Description :This method is used to save space change waitlist request.
   * @description :This method is used to save space change waitlist request.
   * @param payload this is payload.
   */
  saveWaitListChangeRequest(payload: any) {
    return this.http.post(API_URL.saveSpaceChangeWaitlistRequest, payload);
  }

  /**
   * Description :This method is used to update space change waitlist request.
   * @description : This method is used to update space change waitlist request.
   * @param payload this is payload.
   */
  updateWaitListChangeRequest(payload: any) {
    return this.http.put(API_URL.updateWaitlistChangeRequest, payload);
  }

  /**
   * Description : This method is used to update space change waitlist request status.
   * @description :This method is used to update space change waitlist request status.
   * @param payload this is payload.
   */
  updateWaitListChangeRequestStatus(payload: any) {
    return this.http.put(API_URL.updateWaitlistChangeRequestStatus, payload);
  }
  /**
   * @description : This method is used to update notes.
   * Description : This method is used to update notes.
   * @param payload Form values
   */
  async updateNotes(payload: any) {
    const url = API_URL.notes + '/' + payload.id;
    return this.http.put(url, payload);
  }
}

type company_status = '0' | '1' | '2' | '3' | '4' | '5';
type sortOrderType = 'ASC' | 'DESC';

export interface SearchResidentCompanyPayload {
  q: string;
  role: number;
  pagination: boolean;
  page: number;
  limit: number;
  companyStatus: company_status;
  companyVisibility: boolean;
  companyOnboardingStatus: boolean;
  siteIdArr: number[];
  industries: number[];
  modalities: number[];
  fundingSource: number[];
  minFund: number;
  maxFund: number;
  minCompanySize: number;
  maxCompanySize: number;
  sort: boolean;
  sortFiled: string;
  sortOrder: sortOrderType;
  memberShip: string;
}
