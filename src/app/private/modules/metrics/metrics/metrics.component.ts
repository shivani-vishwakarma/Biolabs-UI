import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  sites: any = [];
  selectedSite: any = null;
  applicationId = '';
  constructor(
    public datepipe: DatePipe,
    public defaultDataService: DefaultDataService,
    public router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: any) => {
      await this.getSites();
      if ( params && params.site) {
        const siteId = parseInt(params.site, 10);
        this.selectedSite = siteId;
      }
    });
  }

  async getSites(){
    const sites = await this.defaultDataService.getSiteList();
    this.sites = sites.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
    const site = this.localStorageService.get('SELECTED_SITE');
    this.selectedSite = site;
    if (site && typeof site == 'string' && site != '{}') {
      this.selectedSite = this.localStorageService.get('SELECTED_SITE');
    } else if (site && typeof site == 'object' && Object.keys(site).length > 0) {
      this.selectedSite = this.localStorageService.get('SELECTED_SITE');
    }
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  selectSite(event: any){
    this.router.navigate(['/metrics/sitemetrics'], { queryParams: { site: this.selectedSite }} );

  }

  onSiteToggle(event: any){
  }

  viewCompanyDetails() {
    if (this.applicationId && GLOBAL.USER && GLOBAL.USER.user &&
      GLOBAL.USER.user.companyId &&
      this.applicationId == GLOBAL.USER.user.companyId) {
      return true;
    }
    return false;
  }
}
