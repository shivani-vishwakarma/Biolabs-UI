import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, findNestedObj, GLOBAL } from 'src/app/shared/utility/config.service';
import { API_URL } from 'src/app/core/constants/api-url';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { PrivacyService } from 'src/app/core/services/privacy.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  company: any;
  data: any;
  companyStatus = '';
  industryNameArr: string[] = [];
  modalityNameArr: string[] = [];
  biolabSourceName = '';
  startDate = '';
  // foundedPlace = '';
  fundingSourceName: string[] = [];
  stageOfDevelopment: any = '';
  intellectualProperty: any[] = [];
  intellectualPropertyName = '';
  likeToJoin: { id: number; name: string; } | undefined;
  logoFileSource = API_URL.readLogoURL;
  pitchDeckSource = API_URL.pitchDeck;
  globalDateFormat = environment.globalDateFormat;
  selectedSiteDetail: any;
  companyId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    public defaultDataService: DefaultDataService,
    private router: Router,
    private localStorage: LocalStorageService,
    public privacyService: PrivacyService,
  ) { }

  async ngOnInit() {
    this.viewPrivacydataforSponsor();
    this.intellectualProperty = await this.defaultDataService.getIntellectual();
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(async params => {
        this.companyId = await this.checkId(params.id);
        this.getCompanyById(this.companyId);
      });
    }
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
    // this.activatedRoute.params.subscribe(value => {
    // });
  }

  /**
   * @description : Get company application by application id
   * Description : Get company application by application id
   * @param id applicationId
   */
  getCompanyById(id: number) {
    this.spinner.show();
    const company = this.residentService.getCompanyById(id);
    company.subscribe((resp) => {
      this.spinner.hide();
      this.company = resp;
      if (resp.website) {
        this.company.website = this.addhttp(resp.website);
      }
      this.companyStatus = APPLICATION_STATUS[resp.companyStatus];
      this.getIndustryName(resp.categories, resp.otherIndustries);
      this.getModalityName(resp.modalities, resp.otherModality);
      this.getSourceName(resp.biolabsSources, resp.otherBiolabsSources);
      this.startDate = resp.startDate ? new Date(Number(resp.startDate) * 1000).toISOString().split('T')[0] : '';
      // this.foundedPlace = new Date(resp.foundedPlace * 1000).toDateString();
      this.getFundingName(resp.fundingSources, resp.otherFundingSource);
      this.getStageOfDevelopmentName(resp.companyStages, resp.otherCompanyStage);
      this.getIntellectualPropertyName(resp.intellectualProperty, resp.otherIntellectualProperty);
      this.getMoveInPreferencesOptions(resp.preferredMoveIn);
    }, (error) => {
      this.spinner.hide();
      if (error.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
      console.error('Error in getting applications', error);
    });
  }

  /**
   * Description: gives the name of industries
   * @description gives the name of industries
   * @param industryList Array of industry ids
   * @param otherIndustries for other option in industry
   */
  getIndustryName(industryList: any, otherIndustries: any = {}) {
    this.industryNameArr = [];
    for (const name of industryList) {
      if (name && name.name && (name.id < 9999 || !otherIndustries[name.id])) {
        this.industryNameArr.push(name.name);
      } else {
        this.industryNameArr.push(name.name + ' (' + otherIndustries[name.id] + ')');
      }
    }
  }

  /**
   * Description: gives the name of Modality
   * @description gives the name of Modality
   * @param modalityIds Array of industry ids
   * @param otherModality for other option in industry
   */
  getModalityName(modalityIds: any, otherModality: any = {}) {
    this.modalityNameArr = [];
    for (const name of modalityIds) {
      if (name && name.name && (name.id < 9999 || !otherModality[name.id])) {
        this.modalityNameArr.push(name.name);
      } else {
        this.modalityNameArr.push(name.name + ' (' + otherModality[name.id] + ')');
      }
    }
  }

  /**
   * @description Gives the name of Biolab source
   * Description Gives the name of Biolab source
   * @param source source Id
   * @param otherSource Other source
   */
  getSourceName(source: any, otherSource: string) {
    if (otherSource) {
      this.biolabSourceName = otherSource;
    } else {
      this.biolabSourceName = source.name;
    }
  }

  /**
   * @description Gives the name of Funding Options
   * Description Gives the name of Funding Options
   * @param fundings fundings Ids
   * @param otherFunding Other fundings
   */
  getFundingName(fundings: any, otherFunding: string) {
    this.fundingSourceName = [];
    for (const name of fundings) {
      if (name && name.name && (name.id < 9999 || !otherFunding)) {
        this.fundingSourceName.push(name.name);
      } else {
        this.fundingSourceName.push(name.name + ' (' + otherFunding + ')');
      }
    }
  }

  /**
   * @description Gives the name of Stage of Development
   * Description Gives the name of Stage of Development
   * @param stage stage Ids
   * @param otherStage Other stage
   */
  getStageOfDevelopmentName(stage: any, otherStage: string) {
    if (otherStage) {
      this.stageOfDevelopment = otherStage;
    } else {
      this.stageOfDevelopment = stage.name;
    }
  }

  /**
   * @description Gives the name of Intellectual Property
   * Description Gives the name of Intellectual Property
   * @param properties properties Ids
   * @param otherProperties Other property
   */
  getIntellectualPropertyName(properties: any, otherProperties: string) {
    if (otherProperties) {
      this.intellectualPropertyName = otherProperties;
    } else {
      if (properties) {
        this.intellectualPropertyName = (this.intellectualProperty.find(f => f.id == properties)).name;
      }
    }
  }

  getMoveInPreferencesOptions(selectedId: number) {
    this.likeToJoin = this.defaultDataService.getMoveInPreferences().find(pr => pr.id == selectedId);
  }
  onImgError(event: any) {
    event.target.src = 'assets/images/logo.PNG';
  }
  /**
   * Description: Returns the role
   * @description Returns the role
   */
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  /**
   * Description: Used to display resident specific data
   * @description Used to display resident specific data
   */
  viewCompanyDetails() {
    if (this.companyId && GLOBAL.USER && GLOBAL.USER.user &&
      GLOBAL.USER.user.companyId &&
      this.companyId == GLOBAL.USER.user.companyId) {
      return true;
    }
    return false;
  }

  /**
   * Description: add http:// to a URL if it doesn't already include a protocol (e.g. http://, https://)
   * @description add http:// to a URL if it doesn't already include a protocol (e.g. http://, https://)
   * @param url website link
   */
  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  /**
   * Description: This method check the id has include special character or not
   * @description This method check the id has include special character or not
   * @param id Application Id
   * @returns Application Id
   */
  async checkId(id: any) {
    if (/[@_]/.test(id)) {
      const companies = id.split('@');
      if (companies.length > 0) {
        const companyWithSIte: any = {};
        companies.forEach((i: any) => {
          const splittedValue = i.split('_');
          if (splittedValue.length > 0) {
            companyWithSIte[splittedValue[1]] = splittedValue[0];
          }
        });
        const selectedSite = this.localStorage.get('SELECTED_SITE');
        const companyId = companyWithSIte[selectedSite];
        if (Object.keys(companyWithSIte).includes(selectedSite + '')) {
          if (companyId) {
            return companyWithSIte[selectedSite];
          }
        } else {
          if ((Object.keys(companyWithSIte).length > 1)) {
            return companyWithSIte[Object.keys(companyWithSIte)[0]];
          }
        }
      } else {
        return id;
      }
    } else {
      return id;
    }
  }

  async viewPrivacydataforSponsor() {
    if (this.getRole() == 3) {
      if (this.activatedRoute.parent) {
        this.activatedRoute.parent.params.subscribe(async params => {
          await (await this.privacyService.getPrivacyCompanyById(params.id)).subscribe(res => {
            this.data = res;
          });
        });
      }
    }
  }

  checkPermission(privacy: string) {
    if (this.data && this.data[privacy] && this.getRole() == 3) {
      return true;
    }
    return (this.getRole() != 3) ? true : false;
  }
}
