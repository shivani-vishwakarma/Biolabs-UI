import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { API_URL } from 'src/app/core/constants/api-url';
import { ResidentService } from 'src/app/core/services/resident.service';
import { SponsorService } from '../service/sponsor.service';
import { GLOBAL, ICON } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css'],
})
export class SponsorComponent implements OnInit {
  gloablData: any;
  siteData: any = [];
  companyArr: any = [];
  logoFileSource = API_URL.readLogoURL;
  searchText = '';
  siteType: any = [];
  completeSiteData: any;
  usa_location_map = API_URL.usa_location_map;

  constructor(
    private sponsorService: SponsorService,
    private spinner: NgxSpinnerService,
    private residentService: ResidentService,
    private defaultDataService: DefaultDataService,
  ) { }

  ngOnInit(): void {
    this.sitesWithoutFilter();
    this.getDataBySite();
    this.getGlobalData();
    this.getCompanies();
  }

  /**
   * Description: getting data by siteId
   * @description getting data by siteId
   */
  private getDataBySite() {
    const gloablDataRes = this.sponsorService.getDashboardCompanyDataBySite();
    gloablDataRes.subscribe((response) => {
      this.createSitedataArray(response, 2);
    }, (error) => {

    });
  }
  onSearch() {
  }

  onExplore(siteId: any) {
    this.defaultDataService.isShowFilter = 'explore';
  }


  /**
   * Description: getting global network data
   * @description getting global network data
   */
  private getGlobalData() {
    const gloablDataRes = this.sponsorService.getDashboardCompanyData();
    gloablDataRes.subscribe((response) => {
      this.gloablData = response;
    }, (error) => {

    });
  }

  /**
   * Description: used to add icon on sponsor page
   * @description used to add icon on sponsor page
   * @param id industryID
   */
  getIcon(id: string) {
    return ICON[id] ? ICON[id] : 'fa-dna';
  }

  /**
   * @description This method will return list of all the applications
   * Description: This method will return list of all the applications
   */
  getCompanies() {
    this.spinner.show();
    const list = this.residentService.getCompanies({ companyVisibility: true, companyStatus: 1, companyOnboardingStatus: true });
    list.subscribe((resp) => {
      this.spinner.hide();
      this.createCompArray(resp, 4);
    }, (error) => {
      this.spinner.hide();
      console.error(error && error.message);
    });
  }

  /**
   * Description: Used to create data for company carousel
   * @description Used to create data for company carousel
   * @param data company data in array
   * @param itemperpage item count to display in one row
   */
  createCompArray(data: any, itemperpage: number) {
    const bundle = [];
    if (data && data.length) {
      for (let i = 0; i < data.length;) {
        const arr = [];
        for (let j = 0; j < itemperpage; j++) {
          if (i < data.length) {
            arr.push(data[i++]);
          } else {
            i++;
          }
        }
        bundle.push(arr);
        this.companyArr.push(arr);
      }
    }
    return bundle;
  }

  /**
   * Description: used to display default image.
   * @description used to display default image.
   * @param event image onError event
   */
  onImgError(event: Event) {
    const element = event.target as HTMLInputElement;
    element.src = '/assets/images/blPlaceholder.png';
  }

  /**
   * Description: Fallback if azure fails to provide image.
   * @description Fallback if azure fails to provide image.
   * @param event image onError event
   */
  noUSAImage(event: Event) {
    const element = event.target as HTMLInputElement;
    element.src = '/assets/images/Location.PNG';
  }

  /**
   * Description: used to add site color on sponsor page
   * @description used to add site color on sponsor page
   * @param id industryID
   */
  getSiteColor(id: string) {
    const site = this.completeSiteData.find((sId: any) => sId.id == id);
    return site.colorCode ? site.colorCode : '';
  }

  /**
   * Description: Used to create data for sites carousel
   * @description Used to create data for sites carousel
   * @param data site data in array
   * @param itemperpage item count to display in one carousel
   */
  createSitedataArray(data: any, itemperpage: number) {
    const bundle = [];
    if (data && data.length) {
      for (let i = 0; i < data.length;) {
        const arr = [];
        for (let j = 0; j < itemperpage; j++) {
          if (i < data.length) {
            arr.push(data[i++]);
          } else {
            i++;
          }
        }
        bundle.push(arr);
        this.siteData.push(arr);
      }
    }
    return bundle;
  }

  /**
   * @description Used to show appropriate company to sponsor.
   * Description: Used to show appropriate company to sponsor.
   * @param siteId Site Id
   * @returns it returns the presence of sites.
   */
  getCompanyAccessSite(siteid: any) {
    if (!(GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.site_id &&
      (GLOBAL.USER.user.site_id.filter((sId: any) => parseInt(sId, 10) == siteid).length > 0))) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * Description: returns full site data
   * @description returns full site data
   */
  sitesWithoutFilter() {
    this.sponsorService.sitesWithoutFilter().subscribe((response) => {
      if (response && response.length) {
        this.completeSiteData = response;
      }
    }, (error) => {
      this.completeSiteData = [];
    });
  }
}
