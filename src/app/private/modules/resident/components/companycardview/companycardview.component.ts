import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, QueryList, SimpleChanges, OnChanges, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { API_URL } from 'src/app/core/constants/api-url';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, COMMITTEE_STATUS, COMPANY_STATUS, CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { InvoiceWaitlistService } from '../../../invoice-waitlist/services/invoice-waitlist.service';
import { UserManagementService } from '../../../user/services/user-management.service';

/**
 * Description: Enum for waiting list status.
 * @description Enum for waiting list status.
 */
enum WaitingListStatus {
  Open = 0,
  ApprovedInProgress = 1,
  ApprovedCompleted = 2,
  Denied = 3,
  Cancelled = 4
}

@Component({
  selector: 'app-companycardview',
  templateUrl: './companycardview.component.html',
  styleUrls: ['./companycardview.component.css']
})
export class CompanycardviewComponent implements OnInit, OnChanges {
  @Input() companyList: any;
  userData: any = [];
  data: any = [];
  siteId = 0;
  globalDateFormat = environment.globalDateFormat;
  logoFileSource = API_URL.readLogoURL;
  siteName = 'Eisai';
  accessSiteArray: any = [];
  constructor(
    public defaultDataService: DefaultDataService,
    private localStorage: LocalStorageService  ) { }

  ngOnInit(): void {
    this.secureSites();
    const siteDetails = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.siteName = siteDetails.name;
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.companyList = changes.companyList.currentValue;
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
   * @description This method is used to display default image.
   * @param event image onError event.
   */
  onImgError(event: any) {
    event.target.src = '/assets/images/blPlaceholder.png';
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

  /**
   * @description This method is used to get header color on cards.
   * Description: This method is used to get header color on cards.
   * @param id Company Status Id.
   * @returns company status header color.
   */
  getStatusColor(id: string) {
    return COMPANY_STATUS[id] ? COMPANY_STATUS[id] : '';
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
}
