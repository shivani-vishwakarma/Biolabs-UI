import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class MemberOnboardOffboardService {

  constructor(private http: HttpService) { }

  /**
   * Description : This method is used to  get member onboarding checklist data.
   * @description :This method is used to  get member onboarding checklist data.
   */
  getMemberOnboardingChecklist(memberId: any, key: any) {
    const apiUrl = API_URL.companyOnboard;
    return this.http.get(`${apiUrl}/${key}/checklist?userId=${memberId}`);
  }

  /**
   * Description : This method is used to  update member onboarding checklist data.
   * @description :This method is used to  update member onboarding checklist data.
   */
  updateMemberOnboardingChecklist(payload: any) {
    return this.http.put(`${API_URL.companyOnboard}/checklist`, payload);
  }

  /**
   * Description : This method is used to  get member offboarding checklist data.
   * @description :This method is used to  get member offboarding checklist data.
   */
  getMemberOffboardingChecklist(memberId: any, key: any) {
    const apiUrl = API_URL.companyOffboard;
    return this.http.get(`${apiUrl}/${key}/checklist?userId=${memberId}`);
  }

  /**
   * Description : This method is used to  update member offboarding checklist data.
   * @description :This method is used to  update member offboarding checklist data.
   */
  updateMemberOffboardingChecklist(payload: any) {
    return this.http.put(`${API_URL.companyOffboard}/checklist`, payload);
  }
}
