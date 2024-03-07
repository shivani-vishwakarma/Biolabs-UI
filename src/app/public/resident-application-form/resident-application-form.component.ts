import { Component, Injectable, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DefaultDataService, inputDollarMasking } from 'src/app/shared/service/default-data.service';
import { TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { ResidentService } from 'src/app/core/services/resident.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CONFIG, DateValidator, minDateValidator } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-resident-application-form',
  templateUrl: './resident-application-form.component.html',
  styleUrls: ['./resident-application-form.component.css']
})
export class ResidentApplicationFormComponent implements OnInit {
  @ViewChild('content') content: any;
  @ViewChild('content2') content2: any;
  selectedDate: any;
  numberMask = inputDollarMasking;
  other: any = {};
  previousAdditionalSites: any = null;
  otherModality: any = {};
  otherText = 'Other';
  referralSourceId = 4;
  indusrtyItems: TreeviewItem[] = [];
  indusrtyPrimaryItems: TreeviewItem[] = [];
  test = [new TreeviewItem({
    text: 'Therapeutics (Biopharma)',
    value: 1,
    collapsed: true,
    checked: false,
    children: [
      {
        text: 'Cardiovascular & Metabolism',
        value: 2,
        collapsed: true,
        checked: false,
        children: [
          {
            text: 'Diabetes and related disorders',
            value: 'Diabetes and related disorders',
            collapsed: true,
            checked: false,
          },
          {
            text: 'Chronic Kidney Disease (CKD)',
            value: 'Chronic Kidney Disease (CKD)',
            collapsed: true,
            checked: false,
          },
          {
            text: 'Cardiovascular Disease (CVD)',
            value: 'Cardiovascular Disease (CVD)',
            collapsed: true,
            checked: false
          }, {
            text: 'NAFLD, NASH, or cirrhosis',
            value: 'NAFLD, NASH, or cirrhosis',
            collapsed: true,
            checked: false
          },
          {
            text: 'Obesity',
            value: 'Obesity',
            collapsed: true,
            checked: false
          },
          {
            text: this.otherText,
            value: '',
            collapsed: true,
            checked: false
          },
        ],
      },
      {
        text: 'Oncology',
        value: 'Oncology',
        collapsed: true,
        checked: false,
        children: [
          {
            text: 'Hematological malignancies',
            value: 'Hematological malignancies',
            checked: false,
            collapsed: true
          },
          {
            text: 'Chronic lymphocytic leukemia (CLL)',
            value: 'Chronic lymphocytic leukemia (CLL)',
            checked: false,
            collapsed: true
          },
          {
            text: 'Mantle cell lymphoma (MCL)',
            value: 'Mantle cell lymphoma (MCL)',
            checked: false,
            collapsed: true
          },
          {
            text: 'Prostate cancer',
            value: 'Prostate cancer',
            checked: false,
            collapsed: true
          },
          {
            text: 'Lung Cancer',
            value: 'Lung Cancer',
            checked: false,
            collapsed: true
          },
          {
            text: 'Pancreatic cancer',
            value: 'Pancreatic cancer',
            checked: false,
            collapsed: true
          },
          {
            text: this.otherText,
            value: '',
            collapsed: true,
            checked: false
          },
        ],
      },
    ],
  }),
  new TreeviewItem({
    text: 'Diagnostics/Biomarkers',
    value: 5,
    collapsed: true,
    checked: false,
    children: []
  }),
  new TreeviewItem({
    text: 'Lab/Research Tools',
    value: 'Lab/Research Tools',
    collapsed: true,
    checked: false,
    children: [
      {
        text: 'Consumer Product',
        value: 'Consumer Product',
        collapsed: true,
        checked: false,
        children: [
          {
            text: 'Skin Health',
            value: 'Skin Health',
            collapsed: true,
            checked: false,
          },
          {
            text: this.otherText,
            value: '',
            collapsed: true,
            checked: false
          },
        ]
      },
      {
        text: 'Digital Health',
        value: 'Digital Health',
        collapsed: true,
        checked: false
      }
    ]
  }),
  ];
  modalityItems: TreeviewItem[] = [];
  info = {};
  form: FormGroup;
  loading = false;
  submitted = false;
  buttonClass = '';
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };
  sitesList: any;
  sites: TreeviewItem[] = [];
  selectedIndustry: any;
  selectedIndustryVal: any;
  selectedPrimaryIndustry: any;
  biolabsSourcesOptions: any;
  otherSourceId = 9999;
  otherFundingId = 9999;
  otherCompanyStageId = 9999;
  otherIntellectualPropertyId = 9999;
  otherFieldLength = 100;
  companyStageOptions: any;
  selectedModality: any;
  fundingSourceOption: any;
  intellectualPropertyOptions: any = [];
  intellectual: { id: number; name: string; }[] = [];
  today = '2999-12-31';
  todayMaxDate: any = { year: 2999, month: 12, day: 31 };
  tomorrow = '2999-12-31';
  moveInPreferencesOptions: any;
  tcfile = `${environment.tncfile}`;
  primarySiteList: any = [];
  optionSelected = false;
  globalDateFormat = environment.globalDateFormat;
  model: any = { year: 2021, month: 1, day: 12 };
  placement = 'bottom';
  dateChange: any;
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  minDate: any = new Date();
  model1 = '';
  model2 = '';

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private defaultData: DefaultDataService,
    private router: Router,
    private renderer: Renderer2,
    private modalService: NgbModal,
  ) {
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.NAME)]],
      email: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.EMAIL)]],
      companyName: ['', [Validators.required, Validators.maxLength(500)]],
      // site: ['', Validators.required],
      biolabsSources: ['', Validators.required],
      otherBiolabsSources: ['', [Validators.maxLength(100)]],
      technology: ['', [Validators.required, Validators.maxLength(1000)]],
      rAndDPath: ['', [Validators.required, Validators.maxLength(1000)]],
      startDate: ['', [Validators.required, DateValidator()]],
      foundedPlace: ['', [Validators.required, Validators.maxLength(100)]],
      companyStage: ['', Validators.required],
      otherCompanyStage: ['', [Validators.maxLength(100)]],
      funding: ['', [Validators.required, Validators.min(0)]],
      fundingSource: ['', Validators.required],
      otherFundingSource: ['', [Validators.maxLength(100)]],
      intellectualProperty: ['', Validators.required],
      otherIntellectualProperty: ['', [Validators.maxLength(100)]],
      isAffiliated: [null, Validators.required],
      affiliatedInstitution: [''],
      noOfFullEmp: ['', [Validators.required, Validators.min(0)]],
      empExpect12Months: ['', [Validators.required, Validators.min(0)]],
      utilizeLab: ['', [Validators.required, Validators.min(0)]],
      expect12MonthsUtilizeLab: ['', [Validators.required, Validators.min(0)]],
      industry: [''],
      primaryIndustry: ['', Validators.required],
      modality: ['', Validators.required],
      equipmentOnsite: ['', [Validators.required, Validators.maxLength(500)]],
      preferredMoveIn: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
      primarySite: ['', Validators.required],
      sitesApplied: [[]],
      website: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      contactPhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15),
      Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]]
    }, {});
  }

  async ngOnInit() {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayParsedDate = todayDate ? todayDate.split('-') : null;
    this.todayMaxDate = todayParsedDate ? {
      year: Number(todayParsedDate[0]),
      month: Number(todayParsedDate[1]),
      day: Number(todayParsedDate[2])
    } : null;
    this.tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    this.spinner.show();
    await this.getSiteList();
    await this.getBiolabsSources();
    await this.getCompanyStage();
    await this.getFundingOptions();
    await this.getIntellectual();
    await this.getModality();
    await this.getIndustry();
    await this.getMoveInPreferences();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.form.controls.primarySite.valueChanges.subscribe(async res => {
      const sitearr = await this.defaultData.getSiteList();
      const selected = this.form.controls.sitesApplied.value;
      sitearr.splice(sitearr.findIndex((site: any) => site.id == res), 1);
      this.sitesList = sitearr;
      if (selected.includes(res)) {
        selected.splice(selected.findIndex((site: any) => site == res), 1);
      }
      this.onSelectedChange(selected);
      this.setSiteResponseintoDropDown(selected);
    });
    this.form.controls.sitesApplied.valueChanges.subscribe(async res => {
      const sitearr = await this.defaultData.getSiteList();
      const selected = this.form.controls.sitesApplied.value;
      for (const selectedsite of res) {
        sitearr.splice(sitearr.findIndex((site: any) => site.id == selectedsite), 1);
      }
      if (res.includes(selected)) {
        this.form.controls.primarySite.patchValue('');
      }
      this.primarySiteList = sitearr.sort((a: any, b: any) => (a.longName > b.longName ? 1 : -1));
    });
    this.form.controls.isAffiliated.valueChanges.subscribe(res => {
      if (res) {
        this.form.controls.affiliatedInstitution.setValidators([Validators.required, Validators.maxLength(250)]);
        this.form.controls.affiliatedInstitution.updateValueAndValidity();
      } else {
        this.form.controls.affiliatedInstitution.setValidators(null);
        this.form.controls.affiliatedInstitution.updateValueAndValidity();
      }
    });
  }
  getIntellectual() {
    this.intellectual = [
      { id: 1, name: 'Yes, exclusively licensed' },
      { id: 2, name: 'Yes, non-exclusively licensed ' },
      { id: 3, name: 'Yes, assigned to our company directly' },
      { id: 4, name: 'No' },
      { id: 9999, name: 'Other' }
    ];
  }
  onSelectedChange(event: any, content?: any, content2?: any) {
    const newValue = Array.isArray(event) ? event : [event];
    const oldValue = Array.isArray(this.previousAdditionalSites) ? this.previousAdditionalSites : [this.previousAdditionalSites];
    const changes: any = newValue.filter((nv: any) => !oldValue.includes(nv));
    if (event.indexOf(12) > -1 || event.indexOf(13) > -1 ){
      if (changes === 12 || changes.indexOf(12) > -1) {
        this.onChange(12, content, content);
      }
      if (changes === 13 || changes.indexOf(13) > -1) {
        this.onChange(13, content2, content2);
      }
    }
    this.previousAdditionalSites = event;
    // this.optionSelected = !this.optionSelected;
    this.form.controls.sitesApplied.setValue(event);
  }
  onSelectedFundingChange(event: any) {
    this.form.controls.fundingSource.setValue(event);
  }
  onSelectedIndustry(event: any) {
    this.selectedIndustry = event;
    this.form.controls.industry.setValue(event);
  }
  onSelectedPrimaryIndustry(event: any) {
    if (!event.length) {
      return;
    }
    if (event.length > 1) {
      if (this.selectedIndustryVal) {
        const option = TreeviewHelper.findItemInList(this.indusrtyPrimaryItems, this.selectedIndustryVal);
        option.checked = false;
        const primaryItemIndex = event.indexOf(this.selectedIndustryVal);
        const arr = event.splice(primaryItemIndex, 1);
        if (event.length === 1) {
          this.selectedIndustryVal = event[0];
          this.selectedPrimaryIndustry = event;
          this.form.controls.primaryIndustry.setValue(event);
          const primaryOption = TreeviewHelper.findItemInList(this.indusrtyPrimaryItems, event[0]);
          primaryOption.checked = true;
        } else {
          event.forEach((element: any) => {
            const primaryOptions = TreeviewHelper.findItemInList(this.indusrtyPrimaryItems, element);
            primaryOptions.checked = false;
          });
          const selectedOption = TreeviewHelper.findItemInList(this.indusrtyPrimaryItems, this.selectedIndustryVal);
          selectedOption.checked = true;
        }
      } else {
        event.forEach((element: any) => {
          const primaryOptions = TreeviewHelper.findItemInList(this.indusrtyPrimaryItems, element);
          primaryOptions.checked = false;
        });
      }
      return;
    } else {
      this.selectedIndustryVal = event[0];
      this.selectedPrimaryIndustry = event;
      this.form.controls.primaryIndustry.setValue(event);
    }
  }
  onSelectedModality(event: any) {
    this.selectedModality = event;
    this.form.controls.modality.setValue(event);

  }
  onFilterChange(event: any) {
  }
  removeItem(item: any) {

  }

  async getSiteList() {
    this.sitesList = await this.defaultData.getSiteList();
    this.primarySiteList = this.sitesList.sort((a: any, b: any) => (a.longName > b.longName ? 1 : -1));
    this.primarySiteList = this.primarySiteList.filter((site: any) => site.id !== 2);
    // const index = this.primarySiteList.findIndex((ele: any) => ele.id == 2);
    // this.primarySiteList.splice(index, 1);
    this.setSiteResponseintoDropDown();
    return this.sitesList;
  }

  setSiteResponseintoDropDown(selectedItem?: string[]) {
    this.sites = [];
    this.sitesList.sort((a: any, b: any) => (a.longName > b.longName ? 1 : -1));
    const index = this.sitesList.findIndex((ele: any) => ele.id == 2);
    this.sitesList.splice(index, 1);
    if (this.sitesList && this.sitesList.length) {
      for (const element of this.sitesList) {
        const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
        const option: TreeviewItem = new TreeviewItem({ text: element.longName, value: element.id, checked });
        this.sites.push(option);
      }
    } else {
      console.log('No site list found application', this.sitesList);
    }
  }

  async onChange(value: number, content: any, content2: any) {
    if (value == 12) {
      this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
    }
    if (value == 13) {
      this.modalService.open(content2, { backdropClass: 'light-blue-backdrop' });
    }

  }

  async getBiolabsSources() {
    this.biolabsSourcesOptions = await this.defaultData.getBioLabsSource();
    return this.biolabsSourcesOptions;
  }

  async getCompanyStage() {
    this.companyStageOptions = await this.defaultData.getCompanyStage();
    return this.companyStageOptions;
  }

  async getFundingOptions() {
    const funding = await this.defaultData.getFundingOptions();
    this.setFundingintoDropDown(funding);
    return funding;
  }
  setFundingintoDropDown(funding: any[], selectedItem?: string[]) {
    this.fundingSourceOption = [];
    for (const element of funding) {
      const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
      const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
      this.fundingSourceOption.push(option);
    }
  }

  async getModality() {
    const modality = await this.defaultData.getModality();
    // this.generateModalityOptions(modality);
    this.modalityItems = this.generateTreeViewOptions(modality);
    return modality;
  }
  generateModalityOptions(data: any) {
    this.modalityItems = [];
    for (const iterator of data) {
      this.modalityItems.push(new TreeviewItem({
        text: iterator.name,
        value: iterator.id,
        collapsed: true,
        checked: false
      }));
    }
  }
  async getIndustry() {
    const indusrtyItems = await this.defaultData.getIndustry();
    this.indusrtyItems = this.generateTreeViewOptions(indusrtyItems);
    this.indusrtyPrimaryItems = this.generateTreeViewOptions(indusrtyItems);
    return indusrtyItems;
  }

  async getMoveInPreferences() {
    this.moveInPreferencesOptions = await this.defaultData.getMoveInPreferences();
    return this.moveInPreferencesOptions;
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
        children: child,
      }));
    }
    return options;
  }
  checkOtherInTree(selectedData: any, otherData: any) {
    if (selectedData && selectedData.length > 0) {
      const othersData = selectedData.filter((sd: any) => sd > 9999);
      for (const iterator of othersData) {
        if (!otherData[iterator]) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  async onSubmit() {
    this.submitted = true;
    const parserStartDate = this.form.value.startDate ? this.form.value.startDate.split('-') : null;
    this.form.value.startDate = (parserStartDate && parserStartDate.length === 3) ? parserStartDate[2] + '-' +
      (parserStartDate[1].length === 2 ? parserStartDate[1] : `0${parserStartDate[1]}`) + '-' +
      (parserStartDate[0].length === 2 ? parserStartDate[0] : `0${parserStartDate[0]}`) : null;
    if (this.form.invalid || (this.form.value.isAffiliated && !this.form.value.affiliatedInstitution)
      || (this.form.value.biolabsSources == this.otherSourceId && !this.form.value.otherBiolabsSources)
      || (this.form.value.companyStage == this.otherCompanyStageId && !this.form.value.otherCompanyStage)
      || (this.form.value.fundingSource && this.form.value.fundingSource.length > 0 &&
        this.form.value.fundingSource.indexOf(this.otherFundingId) > -1 && !this.form.value.otherFundingSource)
      || (this.form.value.intellectualProperty == this.otherIntellectualPropertyId && !this.form.value.otherIntellectualProperty)
      || this.checkOtherInTree(this.form.value.industry, this.other)
      || this.checkOtherInTree(this.form.value.modality, this.otherModality)) {
      setTimeout(() => {
        const el = this.renderer.selectRootElement('.is-invalid', true).parentElement;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      return false;
    }
    this.loading = true;
    this.form.value.funding = this.form.value.funding ? +(this.form.value.funding.replace(/,/g, '')) : '';
    const formData = { ...this.form.value, otherIndustries: this.other, otherModality: this.otherModality };
    formData.primarySite = [formData.primarySite];
    // , ...formData.sitesApplied
    formData.site = [...formData.primarySite];
    const response = this.residentService.submitResidentForm(formData);
    response.then(data => {
      this.loading = false;
      this.toastr.success(CONFIG.SUCCESS_MSG.POST_RESIDENT, '', {
        timeOut: 5000,
        closeButton: true
      });
      this.router.navigate(['/success'], { replaceUrl: true });
    }, error => {
      this.loading = false;
      console.error('error');
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.POST_RESIDENT, '', {
        timeOut: 5000,
        closeButton: true
      });
    });
    return true;
  }

  showOtherFundingOption(value: any) {
    return value.indexOf(this.otherFundingId) > -1;
  }
}
