import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/core/constants/api-url';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { InvoiceWaitlistService } from '../../../invoice-waitlist/services/invoice-waitlist.service';
import { UserManagementService } from '../../../user/services/user-management.service';

@Component({
  selector: 'app-resident-applications',
  templateUrl: './resident-applications.component.html',
  styleUrls: ['./resident-applications.component.css']
})
export class ResidentApplicationsComponent implements OnInit {
  filterObject: {
    companyStatus: string;
    companyVisibility: string;
    companyOnboardingStatus: string;
    committeeStatus: string;
  } = this.getFilterDataFromLocalStorage();
  company: any;
  companyList: any = [];
  userData: any = [];
  data: any = [];
  companyArr: any = [];
  selecteSiteId: any;
  siteData: any;
  month = '';
  siteId = 0;
  loading = false;
  openspaceChangeWaitlistData: any = [];
  companyStatus: string = this.filterObject.companyStatus;
  companyVisibility: string = this.filterObject.companyVisibility;
  companyOnboardingStatus: string = this.filterObject.companyOnboardingStatus;
  committeeStatus: string = this.filterObject.committeeStatus;
  sortBy = '';
  sortThrough = {
    date: false,
    alpha: false
  };
  globalDateFormat = environment.globalDateFormat;
  userTypeArr: { id: number; name: string; }[] = [];
  siteName = 'Eisai';
  accessSiteArray: any = [];
  tableView = true;
  cardview = false;
  manageuser = false;
  constructor(
    private spinner: NgxSpinnerService,
    private residentService: ResidentService,
    public defaultDataService: DefaultDataService,
    private localStorage: LocalStorageService  ) { }

  ngOnInit(): void {
    this.getCompaniesAndUsers();
    this.secureSites();
    const siteDetails = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.siteName = siteDetails.name;
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
  /**
   * @description This method will return list of all the resident applications.
   * Description: This method will return list of all the resident applications.
   */
  async getCompanies(filterObj?: object) {
    this.spinner.show();
    const list = await this.residentService.getResidentCompanies(filterObj);
    list.subscribe((resp) => {
      this.spinner.hide();
      this.companyList = resp;
    }, (error) => {
      this.spinner.hide();
      console.error(error && error.message);
    });
  }

  /**
   * @description This method is used to filter the data.
   * Description: This method is used to filter the data.
   */
  getFilterData() {
    const filterObj = {
      companyStatus: this.companyStatus,
      companyVisibility: this.companyVisibility,
      companyOnboardingStatus: this.companyOnboardingStatus,
      committeeStatus: this.committeeStatus,
      sortBy: this.sortBy,
    };
    this.setFilterDataToLocalStorage(filterObj);
    this.getCompanies(filterObj);
  }

  /**
   * @description This method is used to remove the filter.
   * Description: This method is used to remove the filter.
   */
  removefilter() {
    this.companyStatus = '';
    this.companyVisibility = '';
    this.companyOnboardingStatus = '';
    this.committeeStatus = '';
    this.sortBy = '';
    this.sortThrough.alpha = true;
    this.sortThrough.date = true;
    const defaultFilterObject = {
      companyStatus: '',
      companyVisibility: '',
      companyOnboardingStatus: '',
      committeeStatus: '',
      sortBy: '',
    };
    this.setFilterDataToLocalStorage(defaultFilterObject);
    this.getFilterData();
  }

  /**
   * @description This method is used to sort data.
   * Description: This method is used to sort data.
   * @param type sort type.
   */
  sortData(type: string) {
    if (type == 'alpha') {
      this.sortThrough.date = false;
      this.sortThrough.alpha = true;
    } else if (type == 'date') {
      this.sortThrough.date = true;
      this.sortThrough.alpha = false;
    } else {
      this.sortThrough.date = false;
      this.sortThrough.alpha = false;
    }
    const filterObj = {
      companyStatus: this.companyStatus,
      companyVisibility: this.companyVisibility,
      companyOnboardingStatus: this.companyOnboardingStatus,
      committeeStatus: this.committeeStatus,
    };
    if (this.sortThrough.alpha || this.sortThrough.date) {
      const filterObjs = { ...filterObj, sortBy: type };
      this.getCompanies(filterObjs);
    } else {
      const filterObjs = { ...filterObj, sortBy: undefined };
      this.getCompanies(filterObjs);
    }
  }

  /**
   * @description This method saves filters to local storage.
   * Description: This method saves filters to local storage.
   */
  setFilterDataToLocalStorage(filterData: object) {
    localStorage.setItem('filterObject', JSON.stringify(filterData));
  }

  tView() {
    this.cardview = false;
    this.manageuser = false;
    this.tableView = true;
  }

  cardView() {
    this.tableView = false;
    this.manageuser = false;
    this.cardview = true;
  }

  manageUser() {
    this.cardview = false;
    this.tableView = false;
    this.manageuser = true;
  }
  getCompaniesAndUsers(){
    this.getCompanies(this.filterObject);
    // this.getUserListuser(this.filterObject);
    // this.getUserList(this.filterObject);
    // this.getOpenspaceChangeWaitlist();
  }
  /**
   * @description This method returns filters from local storage.
   * Description: This method returns filters from local storage.
   */
  getFilterDataFromLocalStorage() {
    const isFilterObject = localStorage.getItem('filterObject');
    return isFilterObject && isFilterObject != null
      ? JSON.parse(isFilterObject)
      : {
        companyStatus: '',
        companyVisibility: '',
        companyOnboardingStatus: '',
        committeeStatus: '',
        sortBy: '',
      };
  }

  // async getUserList(filterObject?: any) {
  //   this.spinner.show();
  //   const userList = await this.userManegmentService.getUserList('Resident');
  //   userList.subscribe(resp => {
  //     this.spinner.hide();
  //     this.userData = resp;
  //     this.data = this.data.concat(this.userData);
  //   }, error => {
  //     this.spinner.hide();
  //     this.loading = false;
  //     this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_ADMIN, '', {
  //       timeOut: 3000,
  //       closeButton: true
  //     });
  //   });
  // }
  // async getUserListuser(filterObj?: any) {
  //   this.spinner.show();
  //   const userList = await this.userManegmentService.getUserList('Resident_User');
  //   userList.subscribe(resp => {
  //     this.spinner.hide();
  //     this.userData = resp;
  //     this.data = this.data.concat(this.userData);
  //     // this.getUserList();
  //   }, error => {
  //     this.spinner.hide();
  //     this.loading = false;
  //     this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_USER, '', {
  //       timeOut: 3000,
  //       closeButton: true
  //     });
  //   });
  // }
  /**
   * Description: Hide and Show tabs for siteAdmin primary Sites.
   * @description This method is used to hide and Show tabs for siteAdmin primary Sites.
   */
  secureSites(): any {
    const userData: any = this.localStorage.get('user');
    if (userData) {
      const token: any = JSON.parse(userData);
      this.accessSiteArray = token.user.site_id;
    }
  }

  /**
   * Description: Hide and Show Icons for siteAdmin primary Sites.
   * @description : This method is used to hide and Show Icons for siteAdmin primary Sites.
   * @param siteId :Id of Site
   * @returns true or false
   */
  checking(siteId: any): any {
    return !this.accessSiteArray.includes(siteId);
  }

}
