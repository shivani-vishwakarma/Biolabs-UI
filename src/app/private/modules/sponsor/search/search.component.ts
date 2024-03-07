import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'jszip';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem } from 'ngx-treeview';
import { type } from 'os';
import { API_URL } from 'src/app/core/constants/api-url';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL, ROLE } from 'src/app/shared/utility/config.service';
import { DEFAULT_MEMBERSHIP_CURRENT, TOTAL_MEMBERSHIP_OPTIONS } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchParam: any = {};
  searchParam2: any = {};
  searchParam3: any = {};
  filterObject: {
    memberShip: any;
    industries: any;
    modalities: any;
    siteIdArr: any;
    fundingSource: any;
    companySizeValue: any;
    minCompanySize: any;
    maxCompanySize: any;
    maxFund: any;
    minFund: any;
    name: any;
    fundingCapacityValue: any;
  } = this.getFilterDataFromLocalStorage();
  companyList: any = [];
  logoFileSource = API_URL.readLogoURL;
  sitesList: any;
  sites: TreeviewItem[] = [];
  buttonClass = '';
  otherFieldLength = '';
  siteId: any;
  test: any;
  config = {
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };
  config1 = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };
  fundingSourceOption: TreeviewItem[] = [];
  fundingCapacity = [
    {
      name: 'All',
      minFund: null,
      maxFund: null
    },
    {
      name: '$0M - $5M',
      minFund: null,
      maxFund: 5000000
    },
    {
      name: '$5M - $10M',
      minFund: 5000000,
      maxFund: 10000000
    },
    {
      name: '$10M - $50M',
      minFund: 10000000,
      maxFund: 50000000
    },
    {
      name: '> $50M',
      minFund: 50000000,
      maxFund: 99999999999
    }
  ];
  fundingCapacityValue = null;
  companySize = [
    {
      name: 'All',
      minCompanySize: null,
      maxCompanySize: null
    },
    {
      name: '1 - 5',
      minCompanySize: 1,
      maxCompanySize: 5
    },
    {
      name: '6 - 10',
      minCompanySize: 6,
      maxCompanySize: 10
    },
    {
      name: '11 - 30',
      minCompanySize: 11,
      maxCompanySize: 30
    },
    {
      name: 'greater than 30',
      minCompanySize: 30,
      maxCompanySize: null,
    }
  ];
  companySizeValue = null;
  memberShip = DEFAULT_MEMBERSHIP_CURRENT;
  funding: any;
  indusrtyItems: TreeviewItem[] = [];
  indusrtyItemsList: any;
  isLocationInvalid = false;

  modalityItems: TreeviewItem[] = [];
  modalityList: any;
  otherModality = {};
  other = {};
  constructor(
    private route: ActivatedRoute,
    private residentService: ResidentService,
    private defaultData: DefaultDataService,
    private spinner: NgxSpinnerService,
    private defaultService: DefaultDataService,
  ) { }
  ngOnInit(): void {
    this.siteId = this.filterObject.siteIdArr;
    this.route.params.subscribe(params => {
      if (params.siteid && params.siteid.split('-')[0] == 'email') {
        this.memberShip = params.siteid.split('-')[1] ? Number(params.siteid.split('-')[1]) : DEFAULT_MEMBERSHIP_CURRENT;
        if (this.memberShip >= TOTAL_MEMBERSHIP_OPTIONS) {
          this.memberShip = DEFAULT_MEMBERSHIP_CURRENT;
        }
        this.searchParam.memberShip = this.memberShip;
      } else if (params.siteid) {
        const isShowFilter = this.defaultData.isShowFilter;
        if (isShowFilter == 'explore') {
          this.siteId = params.siteid;
          this.searchParam.siteIdArr = [parseInt(params.siteid, 10)];
        } else {
          this.searchParam.siteIdArr = this.siteId;
        }
      } else {
        const isShowFilter = this.defaultData.isShowFilter;
        if (isShowFilter === 'true') {
          this.siteId = null;
        }
        this.searchParam.q = params.searchtext;
      }
      this.memberShip = this.filterObject.memberShip ? this.filterObject.memberShip : this.memberShip;
      this.companySizeValue = this.filterObject.companySizeValue ? this.filterObject.companySizeValue : null;
      this.fundingCapacityValue = this.filterObject.fundingCapacityValue
        ? this.filterObject.fundingCapacityValue : null;
      this.sites = this.filterObject.siteIdArr;
      this.fundingSourceOption = this.filterObject.fundingSource;

      this.searchParam.memberShip = this.memberShip;
      this.searchParam2.companySizeValue = this.companySizeValue;
      this.searchParam.minCompanySize = this.filterObject.minCompanySize;
      this.searchParam.maxCompanySize = this.filterObject.maxCompanySize;
      this.searchParam3.fundingCapacityValue = this.fundingCapacityValue;
      this.searchParam.minFund = this.filterObject.minFund;
      this.searchParam.maxFund = this.filterObject.maxFund;
      this.searchParam.siteIdArr = this.sites;
      this.searchParam.fundingSource = this.fundingSourceOption;
      // this.serarchData();
    });
    this.getData();
  }
  async getData() {
    this.sitesList = await this.defaultData.getSiteList();
    if (this.siteId) {
      this.setSiteResponseintoDropDown(this.siteId);
    } else {
      this.setSiteResponseintoDropDown();
    }
    this.getFundingOptions();
    this.getIndustry();
    this.getModality();
  }
  getFilterDataFromLocalStorage() {
    const isFilterObject = localStorage.getItem('filterObject');
    return isFilterObject && isFilterObject != null
      ? JSON.parse(isFilterObject)
      : {
        memberShip: 0,
        industries: [],
        modalities: [],
        siteIdArr: [],
        fundingSource: [],
        minCompanySize: [],
        maxCompanySize: [],
        companySizeValue: [],
        maxFund: [],
        minFund: [],
        fundingCapacityValue: [],
      };
  }
  async getIndustry() {
    this.indusrtyItemsList = await this.defaultData.getIndustry();
    this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList);
    return this.indusrtyItemsList;
  }

  async getModality() {
    this.modalityList = await this.defaultData.getModality();
    // this.generateModalityOptions(modality);
    this.modalityItems = this.generateTreeViewOptions(this.modalityList);
    return this.modalityList;
  }

  generateTreeViewOptions(data: any) {
    const options: TreeviewItem[] = [];
    for (const item of data) {
      let child: TreeviewItem[] = [];
      if (item.children && item.children.length > 0) {
        child = this.generateTreeViewOptions(item.children);
      }
      options.push(new TreeviewItem({
        text: item.name,
        value: item.id,
        collapsed: true,
        checked: false,
        children: child
      }));
    }
    return options;
  }

  serarchData() {
    this.spinner.show();
    this.test = this.searchParam;
    this.setFilterDataToLocalStorage(Object.assign(this.searchParam3, this.searchParam2, this.searchParam));
    const searchResult = this.residentService.searchCompany(this.searchParam);
    searchResult.subscribe((resp) => {
      this.companyList = resp;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      if (error) {
        this.companyList = [];
      }
    });
  }
  /**
   * @description This method saves filters to local storage.
   * Description: This method saves filters to local storage.
   */
  setFilterDataToLocalStorage(filterData: object) {
    localStorage.setItem('filterObject', JSON.stringify(filterData));
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

  async getSiteList() {
    this.sitesList = await this.defaultData.getSiteList();
    // this.siteId = this.filterObject.siteIdArr;
    if (this.siteId && this.siteId.length) {
      this.setSiteResponseintoDropDown(this.siteId);
    } else {
      this.setSiteResponseintoDropDown();
    }
    return this.sitesList;
  }

  setSiteResponseintoDropDown(selectedItem?: string[]) {
    const sponsorSites = this.defaultService.getAccesibleSites();
    this.sites = [];
    const accessibleSites: any = [];
    if (this.getRole() == ROLE.SPONSOR) {
      this.sitesList.find((item: any) => {
        this.accessibleSites(sponsorSites, item, accessibleSites);
      });
      this.iterateOverAccessibleSite(selectedItem, accessibleSites);
    } else if (this.sitesList && this.sitesList.length && this.getRole() != ROLE.SITE_ADMIN) {
      this.iterateOverAccessibleSite(selectedItem, this.sitesList);
    } else if (this.getRole() == ROLE.SITE_ADMIN) {
      this.sitesList.find((item: any) => {
        this.accessibleSites(sponsorSites, item, accessibleSites);
      });
      this.iterateOverAccessibleSite(selectedItem, accessibleSites);
    }
    else {
      console.log('No site list found application', this.sitesList);
    }
  }

  private iterateOverAccessibleSite(selectedItem: string[] | undefined, sitesList: any) {
    for (const element of sitesList) {
      let checked;
      if (selectedItem && Array.isArray(selectedItem) && selectedItem.length) {
        checked = selectedItem?.includes(element.id) ? true : false;
      } else {
        checked = selectedItem && selectedItem == element.id ? true : false;
      }
      if (selectedItem) {
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
        this.sites.push(option);
      } else {
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked: true });
        this.sites.push(option);
      }
    }
  }

  private accessibleSites(sponsorSites: any, item: any, accessibleSites: any) {
    for (const primarySite of sponsorSites) {
      if (item.id == primarySite) {
        accessibleSites.push(item);
      }
    }
  }
  async getFundingOptions() {
    this.funding = await this.defaultData.getFundingOptions();
    const selectedFunds = this.filterObject.fundingSource;
    if (selectedFunds && selectedFunds.length) {
      this.setFundingintoDropDown(this.funding, selectedFunds);
    } else {
      this.setFundingintoDropDown(this.funding);
    }
    return this.funding;
  }
  setFundingintoDropDown(funding: any[], selectedItem?: string[]) {
    this.fundingSourceOption = [];
    for (const element of funding) {
      const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
      if (selectedItem) {
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
        this.fundingSourceOption.push(option);
      } else {
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked: true });
        this.fundingSourceOption.push(option);
      }
    }
  }

  onSelectedChangeLocation(event: any) {
    this.isLocationInvalid = false;
    this.searchParam.siteIdArr = event;
    this.defaultData.isShowFilter = 'false';
    this.setFilterDataToLocalStorage(this.searchParam);
    this.serarchData();
  }

  onSelectedFundingChange(event: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    this.searchParam.fundingSource = event;
    this.setFilterDataToLocalStorage(this.searchParam);
    this.serarchData();
  }

  changeFundingCapacity(selectedData: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    const data: any = this.fundingCapacity.find(x => x.name === selectedData);
    this.searchParam.maxFund = data.maxFund;
    this.searchParam.minFund = data.minFund;
    this.searchParam3.fundingCapacityValue = selectedData;
    this.setFilterDataToLocalStorage(Object.assign(this.searchParam3));
    this.serarchData();
  }

  changeCompanySize(selectedData: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    const data: any = this.companySize.find(x => x.name === selectedData);
    this.searchParam.minCompanySize = data.minCompanySize;
    this.searchParam.maxCompanySize = data.maxCompanySize;
    this.searchParam2.companySizeValue = selectedData;
    this.setFilterDataToLocalStorage(Object.assign(this.searchParam2, this.searchParam));
    this.companySizeValue = selectedData;
    this.serarchData();
  }

  clearDropdowns() {
    this.filterObject.companySizeValue = null;
    this.filterObject.fundingCapacityValue = null;
    this.searchParam.maxFund = null;
    this.searchParam.minFund = null;
    this.searchParam.minCompanySize = null;
    this.searchParam.maxCompanySize = null;
    this.searchParam.fundingSource = [];
    this.searchParam.siteIdArr = [];
    this.fundingCapacityValue = null;
    this.searchParam3.fundingCapacityValue = null;
    this.searchParam2.companySizeValue = null;
    this.companySizeValue = null;
    this.searchParam.memberShip = null;
    this.memberShip = DEFAULT_MEMBERSHIP_CURRENT;
    const defaultFilterObject = {
      maxFund: '',
      minFund: '',
      minCompanySize: '',
      maxCompanySize: '',
      fundingSource: '',
      siteIdArr: '',
      fundingCapacityValue: '',
      companySizeValue: '',
      memberShip: '',
    };
    this.setFilterDataToLocalStorage(defaultFilterObject);
    // localStorage.removeItem('filterObject');
    this.setSiteResponseintoDropDown();
    this.setFundingintoDropDown(this.funding);
    this.serarchData();
  }

  clearFilter() {
    this.searchParam.q = null;
    this.searchParam.industries = null;
    this.searchParam.modalities = null;
    this.modalityItems = this.generateTreeViewOptions(this.modalityList);
    this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList);
    this.serarchData();
  }

  onFilterChange(event: any) {
  }
  onSelectedIndustry(event: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    this.searchParam.industries = event;
    this.serarchData();
  }
  onSelectedModality(event: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    this.searchParam.modalities = event;
    this.serarchData();
  }
  graduatedCompanies(event: any) {
    if (!this.searchParam.siteIdArr.length) {
      this.isLocationInvalid = true;
    }
    this.searchParam.memberShip = event;
    this.serarchData();
  }
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
}
