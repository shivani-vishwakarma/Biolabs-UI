import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceWaitlistService {

  constructor(
    private http: HttpService,
  ) { }

  /**
   * Description: This method get Wait List.
   * @description This method get Wait List.
   * @param param Array of type any.
   * @param companyId This is company Id.
   */
  getWaitList(param: any[], companyId = -1): Observable<any> {
    let statusvar = API_URL.spaceChangeWaitlist;
    for (let i = 0; i < param.length; i++) {
      statusvar += i == 0 ? 'status=' + param[i] : '&status=' + param[i];
    }
    statusvar += '&companyId=' + companyId;
    return this.http.get(statusvar);
  }

  /**
   * Description: This method update Wait List.
   * @description This method update Wait List.
   * @param updatedList Array of update Wait List.
   */
  updateWaitList(updatedList: any[]) {
    const url = API_URL.updateSpaceChangeWaitlist;
    const payload = { spaceChangeWaitlistIds: updatedList };
    return this.http.put(url, payload);
  }

}
