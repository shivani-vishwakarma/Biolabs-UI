import { AfterViewInit, Component, OnDestroy, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, CHECKLIST_STATUS, COMMITTEE_STATUS, CONFIG, GLOBAL, ONBOARD_OFFOARD_STATUS } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { UserManagementService } from '../../../user/services/user-management.service';

@Component({
  selector: 'app-companyresidenttable',
  templateUrl: './companyresidenttable.component.html',
  styleUrls: ['./companyresidenttable.component.css']
})
export class CompanyresidenttableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective> | any;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  userData: any = [];
  data: any = [];
  siteId = 0;
  loading = false;
  globalDateFormat = environment.globalDateFormat;
  userTypeArr: { id: number; name: string; }[] = [];
  siteName = 'Eisai';
  accessSiteArray: any = [];
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public defaultDataService: DefaultDataService,
    private localStorage: LocalStorageService,
    private userManegmentService: UserManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.commoncall();
    this.secureSites();
    const siteDetails = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.siteName = siteDetails.name;
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'lfBrtip',
      ordering: true,
      destroy: true,
      retrieve: true,
      multiple: true,
      buttons: [
        {
          extend: 'csv',
          footer: true,
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 8, 9, 11]
          },
          title: this.siteName + ' Residents List ',
        },
        {
          extend: 'print',
          footer: true,
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 8, 9, 11]
          },
          title: this.siteName + ' Residents List ',
        }
      ]
    };
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }

  /**
   * @description This method is used to get the text from status id.
   * Description: This method is used to get the text from status id.
   * @param status Status Id.
   * @returns will return application status in text.
   */
  getstatusText(status: number) {
    return APPLICATION_STATUS[status];
  }

  /**
   * @description This method is used to get the text from status id.
   * Description: This method is used to get the text from status id.
   * @param status Status Id.
   * @returns will return application status in text.
   */
  getChecklistStatusText(status: number) {
    return ONBOARD_OFFOARD_STATUS[status];
  }

  /**
   * @description This method is used to get committee status text.
   * Description: This method is used to get committee status text.
   * @param status Status Id.
   * @returns committee status text.
   */
  getCommitteeText(status: number) {
    return COMMITTEE_STATUS[status] || '-';
  }

  commoncall() {
    this.getUserListuser();
    this.getUserList();
  }

  async getUserList() {
    this.spinner.show();
    const userList = await this.userManegmentService.getUserList('Resident');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
      this.data = this.data.concat(this.userData);
      this.rerender();
    }, error => {
      this.spinner.hide();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_ADMIN, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }
  async getUserListuser() {
    this.spinner.show();
    const userList = await this.userManegmentService.getUserList('Resident_User');
    userList.subscribe(resp => {
      this.spinner.hide();
      this.userData = resp;
      this.data = this.data.concat(this.userData);
    }, error => {
      this.spinner.hide();
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.LIST_RESIDENT_USER, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }
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

  ngAfterViewInit(): void {
    if (this.data.length) {
      this.dtTrigger.next();
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy(); // Will be ok on last dataTable, will fail on previous instances
          dtElement.dtTrigger.next();
        });
      } else {
        dtElement.dtTrigger.next();
      }
    });
  }
}
