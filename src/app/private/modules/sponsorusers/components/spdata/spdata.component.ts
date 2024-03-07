import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { GlobalSponsorService } from '../../services/global-sponsor.service';

@Component({
  selector: 'app-spdata',
  templateUrl: './spdata.component.html',
  styleUrls: ['./spdata.component.css']
})
export class SpdataComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  globalSponsorsList: any;
  sitesList: any;
  siteName = 'Eisai';
  indusrtyItems: any;

  constructor(
    private globalSponsorService: GlobalSponsorService,
    private defaultDataService: DefaultDataService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'lfBrtip',
      ordering: true,
      buttons: [
        {
          extend: 'csv',
          title:  'Sponsors List',
          footer: true,
        }
      ]
    };
    this.getGlobalSponsors();
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  async getGlobalSponsors() {
    this.spinner.show();
    this.sitesList = await this.defaultDataService.getSiteList();
    this.indusrtyItems = await this.defaultDataService.getIndustry();
    this.globalSponsorService.getGlobalSponsors().subscribe((res) => {
      this.globalSponsorsList = res.data;
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  filterIndustryNames(industries: any) {
    let industryNames: any = [];
    const members = this.getMembers(this.indusrtyItems);
    if (industries && industries.length && this.indusrtyItems && this.indusrtyItems.length) {
      industries.forEach((element: any) => {
        const res = members.find((item: any) => item.id == element);
        industryNames = industryNames.concat(res.name);
      });
    }
    return industryNames;
  }

  getMembers(members: any): any {
    let children: any = [];
    const flattenMembers = members.map((m: any) => {
      if (m.children && m.children.length) {
        children = [...children, ...m.children];
      }
      return m;
    });
    return flattenMembers.concat(children.length ? this.getMembers(children) : children);
  }

  filterSiteNames(sites: any) {
    let siteNames: any = [];
    if (sites && sites.length && this.sitesList && this.sitesList.length) {
      sites.forEach((element: any) => {
        const siteName = this.sitesList.find((item: any) => item.id == element);
        if (siteName) {
          siteNames = siteNames.concat(siteName.name);
        }
      });
    }
    return siteNames;
  }
}
