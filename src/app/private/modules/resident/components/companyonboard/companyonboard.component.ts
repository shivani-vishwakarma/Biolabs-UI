import { Component, OnInit, Renderer2, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService, inputDollarMasking, inputNumberMaskNoIntLimit } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, DateValidator, CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { FileService } from 'src/app/core/services/file.service';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-companyonboard',
  templateUrl: './companyonboard.component.html',
  styleUrls: ['./companyonboard.component.css']
})
export class CompanyonboardComponent implements OnInit {
  numberMask = inputDollarMasking;
  inputNumberMaskNoLimit = inputNumberMaskNoIntLimit;
  company: any;
  companyStatus: any;
  submitted = false;
  form: FormGroup;
  other: any = {};
  otherModality: any = {};
  isFormSubmitted = false;
  otherText = 'Other';
  referralSourceId = 4;
  indusrtyItems: TreeviewItem[] = [];
  indusrtyPrimaryItems: TreeviewItem[] = [];
  modalityItems: TreeviewItem[] = [];
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
  selectedPrimaryIndustry: any;
  selectedIndustryVal: any;
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
  modelStartDate: any;
  tomorrow = '2999-12-31';
  moveInPreferencesOptions: any;
  loading = false;
  buttonClass = '';
  indusrtyItemsList: any;
  modalityList: any;
  fundingList: any;
  displayLogo = '';
  isUploadingFile = false;

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if ((this.form.dirty && !this.isFormSubmitted)) {
      $event.returnValue = true;
    }
  }
  @HostListener('document:click', ['$event'])
  async clickedOut(args: any) {
    const id = args.target.id;
    const value = this.defaultData.isNavigateTrue;
    if (value) {
      return;
    }
    if ((id == 'logout' || id == 'mainSiteDropdown')) {
      const isChangeVal = (this.form.dirty && !this.isFormSubmitted)
        ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
        : true;
      this.defaultData.isNavigateTrue = isChangeVal;
      if (id == 'logout') {
        if (!isChangeVal) {
          return;
        }
        this.defaultData.logout();
      }
    }
  }


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private defaultData: DefaultDataService,
    private router: Router,
    private renderer: Renderer2,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private dateAdapter: NgbDateAdapter<any>,
    public localStorageService: LocalStorageService,
    public datepipe: DatePipe
  ) {
    this.form = this.formBuilder.group({
      // Application form
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.NAME)]],
      email: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.EMAIL)]],
      companyName: ['', [Validators.required, Validators.maxLength(500)]],
      site: ['', Validators.required],
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
      affiliatedInstitution: ['', [Validators.maxLength(250)]],
      noOfFullEmp: ['', [Validators.required, Validators.min(0)]],
      empExpect12Months: ['', [Validators.required, Validators.min(0)]],
      utilizeLab: ['', [Validators.required, Validators.min(0)]],
      expect12MonthsUtilizeLab: ['', [Validators.required, Validators.min(0)]],
      industry: [''],
      primaryIndustry: ['', Validators.required],
      modality: ['', Validators.required],
      equipmentOnsite: ['', [Validators.required, Validators.maxLength(500)]],
      preferredMoveIn: ['', [Validators.required]],

      deckLogo: [''],
      pitchDeck: [''],
      primarySite: [[]],
      sitesApplied: [[]],

      // Onboarding
      website: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      logoOnWall: [''],
      logoOnLicensedSpace: [''],
      bioLabsAssistanceNeeded: ['', [Validators.maxLength(500)]],
      technologyPapersPublished: [''],
      technologyPapersPublishedLinkCount: ['', [Validators.min(0)]],
      technologyPapersPublishedLink: ['', Validators.maxLength(100)],
      patentsFiledGrantedDetails: ['', [Validators.maxLength(500)]],
      patentsFiled: [null],
      patentsGranted: [null],
      activeClinicalTrials: [null],
      clinicalTrialParticipants: [null],
      companyMembers: this.formBuilder.array([]),
      foundersBusinessIndustryBefore: [''],
      foundersBusinessIndustryName: ['', Validators.maxLength(100)],
      companyAdvisors: this.formBuilder.array([]),
      companyTechnicalTeams: this.formBuilder.array([]),
      academiaPartnerships: [''],
      academiaPartnershipDetails: ['', Validators.maxLength(100)],
      industryPartnerships: [''],
      industryPartnershipsDetails: ['', Validators.maxLength(100)],
      companySize: ['', [Validators.min(0)]],
      newsletters: [''],
      elevatorPitch: ['', [Validators.maxLength(1000)]],
      shareYourProfile: [''],
      contactPhoneNumber: ['',
        [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]]


    }, {});
    this.form.valueChanges.subscribe(data => {
      if (this.form.dirty && !this.isFormSubmitted) {
        this.defaultData.isNavigateTrue = false;
      }
    });
    this.addMembers();
    this.addcompanyAdvisors();
    this.addcompanyTechnicalTeams();
  }

  getcompanyMembers(): FormArray {
    return this.form.get('companyMembers') as FormArray;
  }

  public async canExit(isYes?: any) {
    const value = this.defaultData.isNavigateTrue;
    if (value) {
      return true;
    }
    const canExitVal = (this.form.dirty && !this.loading)
      ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
      : true;
    this.defaultData.isNavigateTrue = canExitVal;
    return canExitVal;
  }

  validateMember(index: number, type: string) {
    const cM = this.form.get('companyMembers') as FormArray;
    return cM.controls[index].get(type) as FormControl;
  }

  addMembers() {
    const control = this.form.get('companyMembers') as FormArray;
    control.push(this.patchMembers());

  }
  removeMember(index: number, id: number, type: string) {
    const control = this.form.get('companyMembers') as FormArray;
    control.removeAt(index);
    this.deleteMember(id, type);
  }

  patchMembers() {
    return this.formBuilder.group({
      id: [''],
      name: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.NAME)]],
      title: ['', Validators.maxLength(100)],
      email: ['', [Validators.pattern(CONFIG.REGEX.EMAIL)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(new RegExp(CONFIG.REGEX.PHONE))]],
      linkedinLink: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      publications: [''],
      academicAffiliation: [''],
      joiningAsMember: [null],
      mainExecutivePOC: [null],
      laboratoryExecutivePOC: [null],
      invoicingExecutivePOC: [null],
    });
  }

  getcompanyAdvisors(): FormArray {
    return this.form.get('companyAdvisors') as FormArray;
  }
  validateAdvisors(index: number, type: string) {
    const cM = this.form.get('companyAdvisors') as FormArray;
    return cM.controls[index].get(type) as FormControl;
  }
  addcompanyAdvisors() {
    const control = this.form.get('companyAdvisors') as FormArray;
    control.push(this.formBuilder.group({
      id: [''],
      name: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.NAME)]],
      title: ['', Validators.maxLength(100)],
      organization: ['', Validators.maxLength(100)]
    }));
  }

  removeCompanyAdvisors(index: number, id: number, type: string) {
    const control = this.form.get('companyAdvisors') as FormArray;
    control.removeAt(index);
    this.deleteMember(id, type);
  }

  getcompanyTechnicalTeams(): FormArray {
    return this.form.get('companyTechnicalTeams') as FormArray;
  }

  validateCompanyTechnicalTeams(index: number, type: string) {
    const cM = this.form.get('companyTechnicalTeams') as FormArray;
    return cM.controls[index].get(type) as FormControl;
  }
  addcompanyTechnicalTeams() {
    const control = this.form.get('companyTechnicalTeams') as FormArray;
    control.push(this.formBuilder.group({
      id: [''],
      name: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.NAME)]],
      title: ['', Validators.maxLength(100)],
      email: ['', [Validators.pattern(CONFIG.REGEX.EMAIL)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(new RegExp(CONFIG.REGEX.PHONE))]],
      linkedinLink: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      publications: [''],
      joiningAsMember: [null],
      laboratoryExecutivePOC: [null],
      emergencyExecutivePOC: [null],
      invoicingExecutivePOC: [null],
    }));
  }

  removeCompanyTechnicalTeams(index: number, id: number, type: string) {
    const control = this.form.get('companyTechnicalTeams') as FormArray;
    control.removeAt(index);
    this.deleteMember(id, type);
  }

  async ngOnInit() {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayParsedDate = todayDate ? todayDate.split('-') : null;
    this.todayMaxDate = todayParsedDate ? ({
      year: Number(todayParsedDate[0]),
      month: Number(todayParsedDate[1]),
      day: Number(todayParsedDate[2])
    }) : null;

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
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.getCompanById(params.id);
      });
    }

  }
  showOtherFundingOption(value: any) {
    return value && value.indexOf(this.otherFundingId) > -1;
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
  onSelectedChange(event: any) {
    this.form.controls.site.setValue(event);
  }
  onSelectedFundingChange(event: any) {
    if (this.form.controls.fundingSource.value.length != event.length) {
      this.form.controls.fundingSource.markAsDirty();
    }
    this.form.controls.fundingSource.setValue(event);
  }
  onSelectedIndustry(event: any) {
    this.selectedIndustry = event;
    if (this.form.controls.industry.value.length != event.length) {
      if (this.form.controls.industry.value.length && !event.length) {
        return;
      }
      this.form.controls.industry.markAsDirty();
    }
    this.form.controls.industry.setValue(event);
  }
  onSelectedModality(event: any) {
    this.selectedModality = event;
    if (this.form.controls.modality.value.length != event.length) {
      this.form.controls.modality.markAsDirty();
    }
    this.form.controls.modality.setValue(event);
  }
  onSelectedPrimaryIndustry(event: any) {
    if (!event.length) {
      return;
    }
    if (this.form.controls.primaryIndustry.value.length != event.length) {
      this.form.controls.primaryIndustry.markAsDirty();
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
  onFilterChange(event: any) {
  }
  removeItem(item: any) {

  }

  async getSiteList() {
    this.sitesList = await this.defaultData.getSiteList();
    this.setSiteResponseintoDropDown();
    return this.sitesList;
  }

  setSiteResponseintoDropDown(selectedItem?: string[]) {
    this.sites = [];
    if (this.sitesList && this.sitesList.length) {
      for (const element of this.sitesList) {
        const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
        const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
        this.sites.push(option);
      }
    } else {
      console.log('No site list found', this.sitesList);
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
    this.fundingList = await this.defaultData.getFundingOptions();
    this.setFundingintoDropDown(this.fundingList);
    return this.fundingList;
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
    this.modalityList = await this.defaultData.getModality();
    // this.generateModalityOptions(modality);
    this.modalityItems = this.generateTreeViewOptions(this.modalityList);
    return this.modalityList;
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
    this.indusrtyItemsList = await this.defaultData.getIndustry();
    this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList);
    this.indusrtyPrimaryItems = this.generateTreeViewOptions(this.indusrtyItemsList);
    return this.indusrtyItemsList;
  }

  async getMoveInPreferences() {
    this.moveInPreferencesOptions = await this.defaultData.getMoveInPreferences();
    return this.moveInPreferencesOptions;
  }

  generateTreeViewOptions(data: any, selectedItem?: any) {
    const options: TreeviewItem[] = [];
    for (const item of data) {
      let child: TreeviewItem[] = [];
      if (item.children && item.children.length > 0) {
        child = this.generateTreeViewOptions(item.children, selectedItem);
      }
      const check = selectedItem && selectedItem.indexOf(item.id) > -1 ? true : false;
      options.push(new TreeviewItem({
        text: item.name,
        value: item.id,
        collapsed: true,
        checked: check,
        children: child
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
    this.form.value.funding = this.form.value.funding ? +(this.form.value.funding.replace(/,/g, '')) : '';
    this.submitted = true;
    // this.form.value.startDate = (this.defaultData.dateWithoutTime(new Date(this.form.value.startDate)));
    // const formattedDate = this.form.value.startDate ? this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd') : null;
    const parserStartDate = this.form.value.startDate ? this.form.value.startDate.split('-') : null;
    // const parserStartDate = this.form.value.startDate ? this.form.value.startDate.split('-') : null;
    this.form.value.startDate = (parserStartDate && parserStartDate.length === 3) ? parserStartDate[2] + '-' +
      (parserStartDate[1].length === 2 ? parserStartDate[1] : `0${parserStartDate[1]}`) + '-' +
      (parserStartDate[0].length === 2 ? parserStartDate[0] : `0${parserStartDate[0]}`) : null;
    this.form.value.startDate = new Date(this.form.value.startDate);
    if (this.form.invalid || (this.form.value.isAffiliated && !this.form.value.affiliatedInstitution)
      || (this.form.value.biolabsSources == this.otherSourceId && !this.form.value.otherBiolabsSources)
      || (this.form.value.companyStage == this.otherCompanyStageId && !this.form.value.otherCompanyStage)
      || (this.form.value.fundingSource && this.form.value.fundingSource.length > 0 &&
        this.form.value.fundingSource.indexOf(this.otherFundingId) > -1 && !this.form.value.otherFundingSource)
      || (this.form.value.intellectualProperty == this.otherIntellectualPropertyId && !this.form.value.otherIntellectualProperty)
      || this.checkOtherInTree(this.form.value.industry, this.other)
      || this.checkOtherInTree(this.form.value.modality, this.otherModality)) {
      try {
        setTimeout(() => {
          const el = this.renderer.selectRootElement('.is-invalid', true).parentElement;
          const accordionId = el.parentElement.parentElement.parentElement;
          const accordAnchor = accordionId.parentElement.getElementsByTagName('a')[0];
          // Top level
          if (accordAnchor) {
            // Checking if accordian is close then only opening it by click method.
            if (accordAnchor.getAttribute('aria-expanded') == 'false') {
              accordionId.parentElement.getElementsByTagName('a')[0].click();
            }
            setTimeout(() => {
              const el2 = this.renderer.selectRootElement('.is-invalid', true).parentElement;
              // this.toastr.error('Error in ' + el2.getElementsByTagName('label')[0].innerText, '', {
              //   timeOut: 5000,
              //   closeButton: true
              //   });
              // For scrolling to specific error section.
              el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
            // Inner accordion(s)
          } else {
            const addAccordion = this.renderer.selectRootElement('#additional-accordion', true);
            const anc = accordionId.parentElement.parentElement.parentElement.getElementsByTagName('a')[0];
            if (anc) {
              // checking for main accordion (level zero)
              if (addAccordion && addAccordion.getAttribute('aria-expanded') == 'false') {
                addAccordion.click();
              }
              setTimeout(() => {
                const ancClass = anc.getAttribute('class');
                let ancId = '';
                if (ancClass && ancClass.indexOf('leadership-accordion') > -1) {
                  ancId = 'leadership-accordion';
                } else if (ancClass && ancClass.indexOf('advisor-accordion') > -1) {
                  ancId = 'advisor-accordion';
                } else if (ancClass && ancClass.indexOf('techanical-accordion') > -1) {
                  ancId = 'techanical-accordion';
                }
                const parentAccordion = this.renderer.selectRootElement('#' + ancId, true);
                // checking for child accordion (level one)
                if (parentAccordion && parentAccordion.getAttribute('aria-expanded') == 'false') {
                  parentAccordion.click();
                }
                setTimeout(() => {
                  // checking for child accordion (level two)
                  if (anc && anc.getAttribute('aria-expanded') == 'false') {
                    anc.click();
                  }
                  setTimeout(() => {
                    const el2 = this.renderer.selectRootElement('.is-invalid', true).parentElement;
                    // this.toastr.error('Error in ' + parentAccordion.innerText + ' > ' +
                    //   el2.getElementsByTagName('label')[0].innerText, '', {
                    //   timeOut: 5000,
                    //   closeButton: true
                    //   });
                    // For scrolling to specific error section.
                    el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 500);
                }, 300);
              }, 300);
            } else {
              const appAccordion = this.renderer.selectRootElement('#application-accordion', true);
              // checking for main accordion (level zero)
              if (appAccordion && appAccordion.getAttribute('aria-expanded') == 'false') {
                appAccordion.click();
              }
              setTimeout(() => {
                const el2 = this.renderer.selectRootElement('.is-invalid', true).parentElement;
                el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 500);
            }
          }
        }, 100);
      } catch (error) {
        console.log('unable to find the error class is-invalid', error && error.message);
      }
      return false;
    }
    this.loading = true;
    this.isFormSubmitted = true;
    // const updateStartDate = this.form.value.startDate ? this.form.value.startDate.split('-') : null;
    // this.form.value.startDate = updateStartDate ? updateStartDate[2] + '-' +
    //   (updateStartDate[1].length === 2 ? updateStartDate[1] : `0${updateStartDate[1]}`) + '-' +
    //   (updateStartDate[0].length === 2 ? updateStartDate[0] : `0${updateStartDate[0]}`) : null;
    this.form.value.patentsFiled = this.form.value.patentsFiled || null;
    this.form.value.patentsGranted = this.form.value.patentsGranted || null;
    this.form.value.activeClinicalTrials = this.form.value.activeClinicalTrials || null;
    this.form.value.clinicalTrialParticipants = this.form.value.clinicalTrialParticipants || null;
    const formData = {
      ...this.form.value,
      otherIndustries: this.other,
      otherModality: this.otherModality,
      id: this.company.id,
      funding: Number(this.form.value.funding)
    };
    const response = this.residentService.updateResidentForm(formData);
    this.defaultData.isNavigateTrue = true;
    response.then(data => {
      this.loading = false;
      this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_COMP_INFO, '', {
        timeOut: 5000,
        closeButton: true
      });
      this.router.navigate(['/resident-companies/' + this.company.id + '/company']);
    }, error => {
      this.loading = false;
      console.error('error');
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPDATE_COMP_INFO, '', {
        timeOut: 5000,
        closeButton: true
      });
    });
    return true;
  }


  /**
   * @description : Get company application by application id
   * Description : Get company application by application id
   * @param id applicationId
   */
  getCompanById(id: number) {
    const company = this.residentService.getCompanyById(id);
    company.subscribe((resp) => {
      this.company = resp;
      this.companyStatus = APPLICATION_STATUS[resp.companyStatus];
      this.patchFormData(resp);
    }, (error) => {
      console.error('Error in getting applications', error);
      if (error.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
    });
  }
  patchFormData(resp: any) {
    // delete resp.companyAdvisors;
    // delete resp.companyTechnicalTeams;
    // delete resp.companyMembers;
    for (let index = 1; index < resp.companyMembers.length; index++) {
      this.addMembers();
    }
    for (let index = 1; index < resp.companyAdvisors.length; index++) {
      this.addcompanyAdvisors();
    }
    for (let index = 1; index < resp.companyTechnicalTeams.length; index++) {
      this.addcompanyTechnicalTeams();
    }
    const parserStartDate = resp.startDate ? new Date(Number(resp.startDate) * 1000).toISOString().split('T')[0] : '';
    const parsedStartDate = parserStartDate ? parserStartDate.split('-') : '';
    this.form.patchValue({
      ...resp, ...{
        biolabsSources: resp.biolabsSources.id,
        // startDate: resp.startDate ? new Date(Number(resp.startDate) * 1000).toISOString().split('T')[0] : ''
        startDate: parsedStartDate.length ? this.dateAdapter.toModel({
          day: Number(parsedStartDate[2]),
          month: Number(parsedStartDate[1]),
          year: Number(parsedStartDate[0])
        }) : null
      }
    });
    this.other = resp.otherIndustries ? resp.otherIndustries : {};
    this.otherModality = resp.otherModality ? resp.otherModality : {};
    this.setSiteResponseintoDropDown(resp.site);
    this.indusrtyItems = this.generateTreeViewOptions(this.indusrtyItemsList, resp.industry);
    this.indusrtyPrimaryItems = this.generateTreeViewOptions(this.indusrtyItemsList, resp.primaryIndustry);
    this.modalityItems = this.generateTreeViewOptions(this.modalityList, resp.modality);
    this.setFundingintoDropDown(this.fundingList, resp.fundingSource);
  }
  onFileChange(event: any, type: string) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (this.checkImageSize(file, type)) {
        this.uploadFile(file, type);
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.displayLogo = reader.result as string;
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      }
    }
  }

  /**
   * @description Used to add validation on file upload
   * @param image File type
   * @param type type of file (Ex logo or pitch)
   */
  checkImageSize(image: File, type: string) {
    if (type === 'logo') {
      if ((!image.name.match(/.(jpg|jpeg|png|svg)$/i)) || image.size == 0) {
        this.toastr.error(CONFIG.FILE_CONFIG.FILE_FORMAT, ' ', {
          timeOut: 3000
        });
        this.form.controls.deckLogo.patchValue('');
        return false;
      } else {
        const file = Math.round((image.size / 1024));
        if (file >= 2 * 1024) {
          this.toastr.error(CONFIG.FILE_CONFIG.COMP_LOGO_SIZE, ' ', {
            timeOut: 3000
          });
          this.form.controls.deckLogo.patchValue('');
          return false;
        } else {
          return true;
        }
      }
    } else if (type === 'pitchdeck') {
      if ((!image.name.match(/.(pdf|pptx|pptm|ppt|potx|ppsx|pps)$/i)) || image.size == 0) {
        this.toastr.error(CONFIG.FILE_CONFIG.FILE_FORMAT, ' ', {
          timeOut: 3000
        });
        this.form.controls.pitchDeck.patchValue('');
        return false;
      } else {
        const file = Math.round((image.size / 1024));
        if (file >= 100 * 1024) {
          this.toastr.error(CONFIG.FILE_CONFIG.PITCH_DECK_SIZE, ' ', {
            timeOut: 3000
          });
          this.form.controls.pitchDeck.patchValue('');
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }

  /**
   * Description: upload file to Azure.
   * @description upload file to Azure.
   * @param file file to be uploaded
   * @param type type of file(pitch deck or company logo)
   */
  uploadFile(file: File, type: string) {
    const msg = (type === 'logo') ? CONFIG.SUCCESS_MSG.UPDATE_COMP_LOGO : CONFIG.SUCCESS_MSG.UPDATE_COMP_PITCH;
    this.isUploadingFile = true;
    this.fileService.uploadFile(type, GLOBAL.USER.user.id, file, this.company.id).subscribe((resp: any) => {
      this.isUploadingFile = false;
      this.toastr.success(msg, '', {
        timeOut: 3000,
        closeButton: true
      });
    }, (error) => {
      this.isUploadingFile = false;
      this.toastr.error(error ? error.message : msg, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  /**
   * Description: used to extract readable filename
   * @description used to extract readable filename
   * @param fileName raw file name
   */
  extractFileName(fileName: string) {
    if (fileName && fileName.indexOf('-') > -1) {
      const startIndex = fileName.indexOf('-', fileName.indexOf('-') + 1);
      const fN = fileName.substring(startIndex + 1);
      return fN;
    }
    return '';
  }

  /**
   * Description: This method is used to delete the list(for advisors,managements,technicals).
   * @description This method is used to delete the list(for advisors,managements,technicals).
   * @param memberId This is member Id.
   */
  deleteMember(memberId: number, type: string) {
    if (memberId) {
      this.spinner.show();
      const response = this.residentService.deleteMemberById(memberId, type);
      response.subscribe(() => {
        this.spinner.hide();
      }, (error: any) => {
        this.spinner.hide();
        this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.DELETE_MEMBER, '', {
          timeOut: 5000,
          closeButton: true
        });
      });
    }
  }
}
