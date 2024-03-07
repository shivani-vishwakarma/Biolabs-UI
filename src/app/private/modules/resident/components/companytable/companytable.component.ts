import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, CHECKLIST_STATUS, COMMITTEE_STATUS, GLOBAL, ONBOARD_OFFOARD_STATUS } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-companytable',
  templateUrl: './companytable.component.html',
  styleUrls: ['./companytable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanytableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  @Input() companyList: any;
  userData: any = [];
  siteId = 0;
  globalDateFormat = environment.globalDateFormat;
  siteName = 'Eisai';
  accessSiteArray: any = [];

  constructor(
    public defaultDataService: DefaultDataService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.secureSites();
    const siteDetails = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.siteName = siteDetails.name;
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'lfBrtip',
      deferRender: true,
      ordering: true,
      buttons: [
        {
          extend: 'csv',
          footer: true,
          exportOptions: {
            columns: [0, 1, 2, 4, 6, 7, 9, 11, 12, 14, 15, 17, 19]
          },
          title: this.siteName + ' Companies List ',
        },
        {
          extend: 'print',
          footer: true,
          exportOptions: {
            columns: [0, 1, 2, 4, 6, 7, 9, 11, 12, 14, 15, 17, 19]
          },
          title: this.siteName + ' Companies List ',
        }
      ]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
        this.companyList = changes.companyList.currentValue;
        this.rerender();
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
      // this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
      const table = $('#data-table').DataTable();
      table.destroy();
      this.dtTrigger.next();
  }
}
