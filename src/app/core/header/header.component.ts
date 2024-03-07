/**
 * The footer- and header folders contains the global component-files,
 * statically used across the entire application. These files will appear on every
 * page in the application.
 */
import { Component, DoCheck, OnInit } from '@angular/core';
import { HttpService } from '../rest/http.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL, highlightTab, sponsorCompanyTab } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { EventsHubService } from '../services/events-hub.service';

@Component({
  selector: 'app-core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin = false;
  userData: any;
  sites: any;
  selectedSite: any;
  selectedSiteDet: any;
  companyId: any;
  param: any;
  primarySiteSelected: any;
  currentUrl: any = [];

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    public defaultService: DefaultDataService,
    private eventsHubService: EventsHubService,
    private route: ActivatedRoute
  ) {
    this.userData = GLOBAL.USER;
    this.router.events.subscribe((value) => {
      this.currentUrl = this.router.url.split('/');
    });
  }

  ngOnInit(): void {
    this.eventsHubService.setUserInfo$.subscribe(
      async (resp) => {
        this.companyId = resp.user?.companyId;
        await this.getSiteList(resp);
      }

    );
    this.route.queryParams.subscribe(param => {
      this.param = param;
    });

    const user = this.localStorage.get('user');
    if (user && typeof user == 'string' && user != '{}') {
      GLOBAL.USER = JSON.parse(user);
      this.companyId = GLOBAL.USER.user?.companyId;
    }
    this.getSiteList();
    this.defaultService.secureSites();
    this.eventsHubService.onDropDownChange().subscribe(
      (site) => {
        this.selectedSite = site;
      }
    );
  }

  // ngDoCheck() {
  //   // this.checkLogin();
  // }

  /**
   * Description: Logout method
   * @description Logout method
   */
  async logout() {
    const value = this.defaultService.isNavigateTrue;
    if (!value) {
      return;
    }
    GLOBAL.USER = {};
    this.localStorage.deleteAll();
    // TODO: Call logout API.
    this.router.navigate(['/login']);
  }

  /**
   * Description: Get user role assigned to user
   * @description Get user role assigned to user
   */
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  /**
   * Description: Used to show/hide loggedIn header tabs
   * @description Used to show/hide loggedIn header tabs
   */
  checkLogin() {
    const user = this.localStorage.get('user');
    GLOBAL.USER = user && typeof user == 'string' && user != '{}' ? GLOBAL.USER : '';
    return GLOBAL.USER && GLOBAL.USER.accessToken ? true : false;
  }

  /**
   * @description Get list of sites
   * Description: Get list of sites
   */
  async getSiteList(resp?: any) {
    this.sites = await this.defaultService.getSiteList();
    const site = this.localStorage.get('SELECTED_SITE');
    if (site && typeof site == 'string' && site != '{}') {
      this.selectedSite = this.localStorage.get('SELECTED_SITE');
    } else if (site && typeof site == 'object' && Object.keys(site).length > 0) {
      this.selectedSite = this.localStorage.get('SELECTED_SITE');
    } else {
      const userData = this.localStorage.get('user');
      if (userData && Object.keys(userData).length > 0) {
        const token: any = JSON.parse(userData);
        if (this.getRole() == 2 || this.getRole() == 4 || this.getRole() == 3 || this.getRole() == 8) {
          this.selectedSite = this.sites && this.sites.length > 0 ? token.user.site_id[0] : '';
          this.selectedSiteDet = this.sites && this.sites.length > 0 ?
            this.sites.filter((siteDetail: any) => siteDetail.id === token.user.site_id[0])[0] : '';
        } else {
          this.selectedSite = this.sites && this.sites.length > 0 ? this.sites[0].id : '';
          this.selectedSiteDet = this.sites && this.sites.length > 0 ? this.sites[0] : '';
        }
        this.localStorage.set('SELECTED_SITE', this.selectedSite);
        this.localStorage.set('SELECTED_SITE_DETAIL', this.selectedSiteDet);
      }
    }
    if (resp) {
      if (this.param && this.param.returnUrl) {
        this.router.navigate([this.param.returnUrl]).then(() => {
          window.location.reload(); // BIOL 334
        });
      } else {
        this.defaultService.roleBasedDashboardNavigation(resp.user.role, this.router);
      }
    }
  }

  /**
   * @description Used to filter the data by siteId
   * @param event select value using $event
   */
  async selectSite(event: Event) {
    const value = this.defaultService.isNavigateTrue;
    if (!value) {
      return;
    }
    const element = event.target as HTMLInputElement;
    let userData = this.localStorage.get('user');
    userData = typeof userData == 'string' ? JSON.parse(userData) : userData;
    userData.user.site_id = [element.value];
    this.localStorage.set('SELECTED_SITE', this.selectedSite);
    const selectedSiteDet = (this.sites && this.sites.length) ? this.sites.filter((site: any) => site.id == this.selectedSite)[0] : '';
    this.localStorage.set('SELECTED_SITE_DETAIL', selectedSiteDet);
    this.router.navigate(['/applications']).then(() => {
      window.location.reload();
    });
  }

  onResidentCompanies(){
  }

  /**
   * @description Used to bold primary Sites
   * @param siteId :Id of Site
   * @returns true or false
   */
  boldPrimarySites(siteId: any) {
    const accessSiteArray: any = this.defaultService.getAccesibleSites();
    return this.getRole() == 2 && accessSiteArray.includes(siteId);
  }

  /**
   * Description: This method returns boolean if header should be highlighted(BIOL-381).
   * @description This method returns boolean if header should be highlighted(BIOL-381).
   */
  highlightHeader() {
    if ((this.getRole() == 4 || this.getRole() == 8) && GLOBAL && GLOBAL.USER && GLOBAL.USER.user &&
      GLOBAL.USER.user.companyId != +this.router.url.split('/')[2]) {
      return false;
    }
    if (this.currentUrl && this.currentUrl[this.currentUrl.length - 1]) {
      return (highlightTab.includes(this.currentUrl[this.currentUrl.length - 1])
        || highlightTab.includes(this.currentUrl[this.currentUrl.length - 2]));
    }
  }

  highlightSponsorHeader(): any {
    // if ((this.getRole() == 4 || this.getRole() == 8) && GLOBAL && GLOBAL.USER && GLOBAL.USER.user &&
    //   GLOBAL.USER.user.companyId != +this.router.url.split('/')[2]) {
    //   return false;
    // }
    if (this.currentUrl && this.currentUrl[this.currentUrl.length - 1]) {
      return (sponsorCompanyTab.includes(this.currentUrl[this.currentUrl.length - 1])
        || sponsorCompanyTab.includes(this.currentUrl[this.currentUrl.length - 2]));
    }
  }
}
