import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyOnboardOffboardService {

  constructor(private http: HttpService) { }

  /**
   * Description : This method is used to  get company onboarding checklist data.
   * @description :This method is used to  get company onboarding checklist data.
   */
  getCompanyOnboardingChecklist(companyId: any, key: any) {
    const apiUrl = API_URL.companyOnboard;
    return this.http.get(`${apiUrl}/${key}/checklist?companyId=${companyId}`);
  }

  /**
   * Description : This method is used to  update company onboarding checklist data.
   * @description :This method is used to  update company onboarding checklist data.
   */
  updateCompanyOnboardingChecklist(payload: any) {
    return this.http.put(`${API_URL.companyOnboard}/checklist`, payload);
  }

  /**
   * Description : This method is used to  get company offboarding checklist data.
   * @description :This method is used to  get company offboarding checklist data.
   */
  getCompanyOffboardingChecklist(companyId: any, key: any) {
    const apiUrl = API_URL.companyOffboard;
    return this.http.get(`${apiUrl}/${key}/checklist?companyId=${companyId}`);
  }

  /**
   * Description : This method is used to  update company offboarding checklist data.
   * @description :This method is used to  update company offboarding checklist data.
   */
  updateCompanyOffboardingChecklist(payload: any) {
    return this.http.put(`${API_URL.companyOffboard}/checklist`, payload);
  }

  /**
   * Description : This method is used to  update company offboarding checklist data.
   * @description :This method is used to  update company offboarding checklist data.
   */
  addCompanyOnboardingCompleteStatus(payload: any) {
    return this.http.put(`${API_URL.companyOffboard}/complete-checklist`, payload);
  }
}
