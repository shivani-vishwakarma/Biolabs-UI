import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GLOBAL, ROLE } from '../utility/config.service';
import { Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultDataService {
  // siteData: { id: number; name: string; }[] = [];
  // isNavigateTrue = new Subject<any>();
  isNavigateTrue = true;
  isShowFilter = 'true';
  isNavTrue = new Subject<any>();

  constructor(
    private http: HttpService,
    private localStorage: LocalStorageService,
    public router: Router
  ) { }


  /**
   * @description Get list of sites
   * Description: Get list of sites
   */
  async getSiteList() {
    const user = this.localStorage.get('user');
    const sessionUser = user && typeof user == 'string' && user != '{}' ? GLOBAL.USER : '';
    const siteIdArr = sessionUser && sessionUser.user && sessionUser.user?.site_id ? sessionUser.user?.site_id : [];

    // if (this.siteData && this.siteData.length) {
    //   return this.siteData;
    // }

    // To pass array in GET call
    let url = '?';
    if (siteIdArr && typeof siteIdArr == 'object') {
      for (const id of siteIdArr) {
        url += 'siteIdArr=' + id + '&';
      }
    }

    // passing user role in GET call for any future use
    if (sessionUser && sessionUser.user && sessionUser.user.role) {
      url += 'role=' + sessionUser.user.role + '&';
    }

    const site = await this.http.get(API_URL.siteList + url, 0).toPromise();
    // this.siteData = site;
    return site;
  }

  /**
   * @description Fetch Biolabs Sources for Appication Form
   * Description: Fetch Biolabs Sources for Appication Form
   */
  async getBioLabsSource() {
    const source = await this.http.get(API_URL.source, 0).toPromise();
    return source;
  }

  async logout() {
    const value = this.isNavigateTrue;
    if (!value) {
      return;
    }
    GLOBAL.USER = {};
    this.localStorage.deleteAll();
    // TODO: Call logout API.
    this.router.navigate(['/login']);
  }

  /**
   * @description Fetch Company stages for Appication Form
   * Description: Fetch Company stages for Appication Form
   */
  async getCompanyStage() {
    const stage = await this.http.get(API_URL.companyStage, 0).toPromise();
    return stage;
  }

  /**
   * @description Fetch funding Options for Appication Form
   * Description: Fetch funding Options for Appication Form
   */
  async getFundingOptions() {
    const stage = await this.http.get(API_URL.fundingOptions, 0).toPromise();
    return stage;
  }

  /**
   * @description Fetch Modality for Appication Form
   * Description: Fetch Modality for Appication Form
   */
  async getModality() {
    const stage = await this.http.get(API_URL.modality, 0).toPromise();
    return stage;
  }

  /**
   * @description Fetch Industry for Appication Form
   * Description: Fetch Industry for Appication Form
   */
  async getIndustry() {
    const stage = await this.http.get(API_URL.industry, 0).toPromise();
    return stage;
  }

  /**
   * @description update user session Data
   * Description: update user session Data
   * @param userObj user object
   */
  updateUserSession(userObj: any) {
    if (!GLOBAL.USER || !GLOBAL.USER.user || GLOBAL.USER.user.id == userObj.id) {
      GLOBAL.USER.user = userObj;
      this.localStorage.set('user', JSON.stringify(GLOBAL.USER));
    }
  }

  /**
   * @description Create user session Data
   * Description: Create user session Data
   * @param loginResponse user object
   */
  createUserSession(loginResponse: any) {
    GLOBAL.USER = loginResponse;
    this.localStorage.set('user', JSON.stringify(GLOBAL.USER));
  }

  roleBasedDashboardNavigation(role: number, router: Router) {
    switch (role) {
      case ROLE.SUPER_ADMIN:
        this.navigate('/user/management', router);
        break;
      case ROLE.SITE_ADMIN:
        this.navigate('/applications', router);
        break;
      case ROLE.SPONSOR:
        this.navigate('/sponsor-view/sponsor', router);
        break;
      case ROLE.RESIDENT:
        this.navigate('/directory/directory-companies', router);
        break;
      case ROLE.ACCOUNTANT:
        this.navigate('/invoice-waitlist/invoice-summary', router);
        break;
      case ROLE.SPONSOR_MANAGER:
        this.navigate('/spusertab/spdata', router);
        break;
      case ROLE.BUSINESS_MANAGER:
        this.navigate('/applications', router);
        break;
      case ROLE.RESIDENT_USER:
        this.navigate('/directory/directory-companies', router);
        break;

      default:
        this.navigate('/user/management', router);
    }
  }

  /**
   * Description: Reload the page after successful navigation.
   * @description Reload the page after successful navigation.
   * @param url url to navigate based on roles
   * @param router Router object
   */
  navigate(url: string, router: Router) {
    router.navigate([url]).then(() => {
      window.location.reload();
    });
  }
  /**
   * @description Fetch intellectual Properties
   */
  getIntellectual() {
    return [
      { id: 1, name: 'Yes, exclusively licensed' },
      { id: 2, name: 'Yes, non-exclusively licensed ' },
      { id: 3, name: 'Yes, assigned to our company directly' },
      { id: 4, name: 'No' },
      { id: 9999, name: 'Other' }
    ];
  }

  /**
   * @description Fetch Company status for Appication Form
   * Description: Fetch Company stages for Appication Form
   */
  async getCompanyStatus() {
    const status = await this.http.get(API_URL.companyStatus, 0).toPromise();
    return status;
  }

  /**
   * @description Fetch Move in Preferences for Appication Form
   * Description: Fetch Move in Preferences for Appication Form
   */
  getMoveInPreferences(): { id: number, name: string }[] {
    return [
      { id: 1, name: 'Within 1 month' },
      { id: 2, name: '2 - 3 months' },
      { id: 3, name: '4 - 6 months' },
      { id: 4, name: 'More than 6 months' }
    ];
  }

  /**
   * @description Fetch User Type (Employee, Scientist etc) for user
   * Description: Fetch User Type (Employee, Scientist etc) for user
   */
  async getUserType() {
    const status = await this.http.get(API_URL.userType, 0).toPromise();
    return status;
  }

  /**
   * @description Fetch Committee Status
   * Description: Fetch Committee Status
   */
  public async getCommitteeStatus() {
    const committeeStatus = await this.http.get(API_URL.committeeStatus, 0).toPromise();
    return committeeStatus;
  }

  /**
   * Description: remove timeZone from Date.
   * @param date date in string
   * @returns returns only date
   */
  dateWithoutTime(date: any) {
    if (date) {
      date = new Date(date);
      return new Date(date.setMinutes(date.getMinutes() + date.getTimezoneOffset()));
    }
    return date;
  }
  /**
   * Description: Hide and Show tabs for siteAdmin primary Sites.
   * @description This method is used to hide and show tabs for siteAdmin primary Sites.
   */
  secureSites(): any {
    const accessSiteArray: any = this.getAccesibleSites();
    const sitechange = +this.localStorage.get('SELECTED_SITE');
    return accessSiteArray.includes(sitechange);
  }
  /**
   * Description :To get PrimarySites (Accessible)array.
   * @description This method is used to get PrimarySites (Accessible)array.
   */
  getAccesibleSites() {
    let accessSiteArray: any = [];
    const userData = this.localStorage.get('user');
    if (userData && Object.keys(userData).length > 0) {
      const token: any = JSON.parse(userData);
      accessSiteArray = token.user.site_id;
      return accessSiteArray;
    }
    return accessSiteArray;
  }

  /**
   * Description: Returns the role of the logged in user.
   * @description Returns the role of the logged in user.
   * @returns numeric value of the role
   */
   getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
}

// create the `numberMask` with your desired configurations
export const inputDollarMasking = createNumberMask({
  prefix: '',
  allowDecimal: true,
});

export const inputNumberMasking = (str: any) => {
  return createNumberMask({
    prefix: '',
    includeThousandsSeparator: false,
    integerLimit: str,
    allowDecimal: false,
  });
};

export const inputNumberMaskNoIntLimit = createNumberMask({
  prefix: '',
  includeThousandsSeparator: false,
  allowDecimal: false,
});

// export const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd MMM y')
// export const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy')
export const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd-mm-yyyy');
// export const autoCorrectedDatePipe = (str: any) => {
//   // return createNumberMask({
//   //   prefix: '',
//   //   includeThousandsSeparator: false,
//   //   integerLimit: str,
//   //   allowDecimal: false,
//   // });
//   return createAutoCorrectedDatePipe('dd-mm-yyyy')
// };
