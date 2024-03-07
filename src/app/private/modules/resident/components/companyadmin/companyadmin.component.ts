import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CONFIG, DateValidator, DateValidators, ROLE } from 'src/app/shared/utility/config.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { requiredIfValidator } from 'src/app/shared/utility/must-match.validator';
// import { CustomDateParserFormatter } from 'src/app/shared/service/date-adapters/custom-date-parser-formatter.service';
// import { CustomDateParserFormatter } from 'src/app/shared/service/date-adapters/custom-date-parser-formatter.service';
@Component({
  selector: 'app-companyadmin',
  templateUrl: './companyadmin.component.html',
  styleUrls: ['./companyadmin.component.css']
})
export class CompanyadminComponent implements OnInit {
  form: FormGroup;
  noteForm: FormGroup;
  submitted = false;
  isForwarded = false;
  isForwardAppValid = false;
  loading = false;
  company: any;
  today = '2999-12-31';
  todayMaxDate = { year: 2999, month: 12, day: 31 };
  modelCommitteeDate: any;
  textAreasList: any = [];
  committeeStatus: any = [];
  notes: any = [];
  selectedData: any = {};
  companyStatusChangeDateFlag = false;
  currentUser: any = null;
  globalDateFormat = environment.globalDateFormat;
  primarySiteList: any = [];
  selectedForwardSite: any = 'Select a site';
  selectedSite: any;
  addTextarea() {
    // this.textAreasList.push('text_area' + (this.textAreasList.length + 1));
    this.textAreasList = ['text_area' + 1];
  }
  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.form.dirty && !this.loading) {
      $event.returnValue = true;
    }
  }
  @HostListener('document:click', ['$event'])
  async clickedOut(args: any) {
    const id = args.target.id;
    const value = this.defaultDataService.isNavigateTrue;
    if (value) {
      return;
    }
    if ((id == 'logout' || id == 'mainSiteDropdown')) {
      const isChangeVal = (this.form.dirty && !this.loading)
        ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
        : true;
      this.defaultDataService.isNavigateTrue = isChangeVal;
      if (id == 'logout') {
        if (!isChangeVal) {
          return;
        }
        this.defaultDataService.logout();
      }
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private router: Router,
    private defaultDataService: DefaultDataService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal,
    private dateAdapter: NgbDateAdapter<any>,
    private cdref: ChangeDetectorRef,
    public datepipe: DatePipe,
  ) {
    this.form = this.formBuilder.group({
      companyStatus: [''],
      companyOnboarding: [''],
      companyVisibility: [''],
      comment: [''],
      committeeDate: ['', [Validators.required]],
      committeeStatus: [''],
      residencyStartDate: [null],
      residencyEndDate: [null]
    });

    this.noteForm = this.formBuilder.group({
      id: [null],
      notes: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.form.valueChanges.subscribe(data => {
      if (this.form.dirty && !this.loading) {
        this.defaultDataService.isNavigateTrue = false;
      }
    });
  }

  ngOnInit(): void {
    let userData = this.localStorageService.get('user');
    if (userData && Object.keys(userData).length > 0) {
      userData = JSON.parse(userData);
      this.currentUser = userData.user;
      if (userData && userData.user && userData.user.role == ROLE.RESIDENT) {
        this.router.navigate(['/error']);
      }
    }
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        if (params && params.id) {
          this.getCompanById(params.id.split('_')[0]);
          this.getNotesByCompanyId(params.id.split('_')[0]);
        }
      });
    }
    this.getCommitteeStatus();
    this.form.controls.committeeStatus.valueChanges.subscribe(res => {
      if (res == 0) {
        this.form.controls.committeeDate.setValidators(null);
        this.form.controls.committeeDate.updateValueAndValidity();
      } else {
        this.form.controls.committeeDate.setValidators([Validators.required, DateValidators()]);
        this.form.controls.committeeDate.updateValueAndValidity();
      }
    });
    this.getSiteList();
  }

  async getSiteList() {
    const sites = await this.defaultDataService.getSiteList();
    this.primarySiteList = sites.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
    const site = this.localStorageService.get('SELECTED_SITE');
    if (site && typeof site == 'string' && site != '{}') {
      this.selectedSite = this.localStorageService.get('SELECTED_SITE');
    } else if (site && typeof site == 'object' && Object.keys(site).length > 0) {
      this.selectedSite = this.localStorageService.get('SELECTED_SITE');
    }
    return sites;
  }

  public async canExit(isYes?: any) {
    const value = this.defaultDataService.isNavigateTrue;
    if (value) {
      return true;
    }
    const canExitVal = (this.form.dirty && !this.loading)
      ? window.confirm('You have unsaved changes. Are you sure you want to leave the page?')
      : true;
    this.defaultDataService.isNavigateTrue = canExitVal;
    return canExitVal;
  }

  onChange(isOnOnboarding: boolean) {
    if (isOnOnboarding == true) {
      this.form.controls.companyVisibility.setValue(isOnOnboarding);
    }
  }

  /**
   * @description : Get company application by application id
   * Description : Get company application by application id
   * @param id applicationId
   */
  getCompanById(id: number) {
    this.spinner.show();
    const company = this.residentService.getCompanyById(id);
    company.subscribe((resp) => {
      this.spinner.hide();
      this.company = resp;
      this.setCompanyData();
      // this.companyStatus = APPLICATION_STATUS[resp.status];
      // this.getIndustryName(resp.categories, resp.otherIndustries);
      // this.getModalityName(resp.modalities, resp.otherModality);
      // this.getSourceName(resp.biolabsSources, resp.otherBiolabsSources);
      // this.startDate = new Date(resp.startDate * 1000).toDateString();
      // this.foundedPlace = new Date(resp.foundedPlace * 1000).toDateString();
      // this.getFundingName(resp.fundingSources, resp.otherFundingSource);
      // this.getStageOfDevelopmentName(resp.companyStages, resp.otherCompanyStage);
      // this.getIntellectualPropertyName(resp.intellectualProperty, resp.otherIntellectualProperty);
    }, (error) => {
      this.spinner.hide();
      if (error.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
      console.error('Error in getting applications', error);
    });
  }

  formatDatetoInput(date: any) {
    const formattedDateWithoutTime = (date) ?
      this.defaultDataService.dateWithoutTime(new Date(date)) : null;
    const formattedDate = formattedDateWithoutTime ? this.datepipe.transform(formattedDateWithoutTime, 'yyyy-MM-dd') : null;
    const parserCommitteeDate = formattedDate ? formattedDate.split('-') : null;
    return parserCommitteeDate;
  }

  async forwardApp() {
    this.isForwarded = true;
    if (!(this.selectedForwardSite && this.selectedForwardSite.id)) {
      this.isForwardAppValid = false;
      return;
    }
    const forwardAppRes = await this.residentService.forwardApplication(this.company.id, this.selectedForwardSite.id);
    forwardAppRes.subscribe(async (res) => {
      if (res && res.error){
        this.toastr.error(res.error ? res.message : CONFIG.ERROR_MSG.UPADTE_STATUS, '', {
          timeOut: 3000,
          closeButton: true
        });
        return;
      }
      // this.isForwarded = true;
      this.isForwardAppValid = true;
      const todayDate = this.datepipe.transform(new Date(), 'dd MMM y');
      const notes = `Application was forwarded to ${this.selectedForwardSite.name} on ${todayDate}.`;
      await this.residentService.addNotes({ companyId: this.company.id, notes });
      await this.getNotesByCompanyId(this.company.id);
    }, (err) => {
      this.toastr.error(err ? err.message : CONFIG.ERROR_MSG.UPADTE_STATUS, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  setCompanyData() {
    // const formattedDateWithoutTime = (this.company.selectionDate) ?
    //       this.defaultDataService.dateWithoutTime(new Date(this.company.selectionDate)) : null;
    // const formattedDate = formattedDateWithoutTime ? this.datepipe.transform(formattedDateWithoutTime, 'yyyy-MM-dd') : null;
    const parserCommitteeDate = (this.company.selectionDate) ? this.formatDatetoInput(this.company.selectionDate) : null ;
    const parserResidentStartDate = (this.company.residencyStartDate) ? this.formatDatetoInput(this.company.residencyStartDate) : null ;
    const parserResidentEndDate = (this.company.residencyEndDate) ? this.formatDatetoInput(this.company.residencyEndDate) : null ;
    this.form.patchValue({
      companyStatus: this.company.companyStatus,
      companyVisibility: this.company.companyVisibility,
      companyOnboarding: this.company.companyOnboardingStatus,
      committeeStatus: this.company.committeeStatus ? this.company.committeeStatus : 0,
      committeeDate: parserCommitteeDate ? this.dateAdapter.toModel({
        day: Number(parserCommitteeDate[2]),
        month: Number(parserCommitteeDate[1]),
        year: Number(parserCommitteeDate[0])
      }) : null,
      residencyStartDate: parserResidentStartDate ? this.dateAdapter.toModel({
        day: Number(parserResidentStartDate[2]),
        month: Number(parserResidentStartDate[1]),
        year: Number(parserResidentStartDate[0])
      }) : null,
      residencyEndDate: parserResidentEndDate ? this.dateAdapter.toModel({
        day: Number(parserResidentEndDate[2]),
        month: Number(parserResidentEndDate[1]),
        year: Number(parserResidentEndDate[0])
      }) : null,
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const status: any = {
      companyId: this.company.id,
      companyStatus: this.form.value.companyStatus,
      companyVisibility: this.form.value.companyVisibility,
      companyOnboardingStatus: this.form.value.companyOnboarding,
      selectionDate: this.form.value.committeeDate ? this.formatParseDate(this.form.value.committeeDate) : null,
      committeeStatus: this.form.value.committeeStatus,
      // committeeDate: this.form.value.committeeDate ? this.formatParseDate(this.form.value.committeeDate) : null,
      residencyStartDate: this.form.value.residencyStartDate ? this.formatParseDate(this.form.value.residencyStartDate) : null,
      residencyEndDate: this.form.value.residencyEndDate ? this.formatParseDate(this.form.value.residencyEndDate) : null,
    };
    status.selectionDate = status.selectionDate ? new Date(status.selectionDate) : null;
    status.residencyStartDate = status.residencyStartDate ? new Date(status.residencyStartDate) : null;
    status.residencyEndDate = status.residencyEndDate ? new Date(status.residencyEndDate) : null;
    status.companyStatusChangeDate = this.companyStatusChangeDateFlag;
    this.loading = true;
    const response = await this.residentService.updateCompStatus(status);
    this.defaultDataService.isNavigateTrue = true;
    response.subscribe(data => {
      this.loading = false;
      this.toastr.success(CONFIG.SUCCESS_MSG.UPADTE_STATUS, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.router.navigate(['/resident-companies/' + this.company.id + '/company']);
    }, error => {
      this.loading = false;
      console.error('error');
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.UPADTE_STATUS, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  /**
   * Description: This method is used to get list of selection committee list
   * @description This method is used to get list of selection committee list
   */
  async getCommitteeStatus() {
    this.committeeStatus = await this.defaultDataService.getCommitteeStatus();
    return this.committeeStatus;
  }

  /**
   * Description: This method is used to post/submit notes
   * @description This method is used to post/submit notes
   */
  async onNoteSubmit() {
    if (this.noteForm.valid && this.company && this.company.id) {
      await this.residentService.addNotes({ companyId: this.company.id, notes: this.noteForm.value.notes });
      await this.getNotesByCompanyId(this.company.id);
      this.noteForm.reset();
      this.textAreasList = [];
    }
  }

  /**
   * Description: This method is used to gets notes.
   * @description This method is used to gets notes.
   * @param companyId This is company id.
   */
  async getNotesByCompanyId(companyId: number) {
    this.notes = await this.residentService.getNotesByCompanyId(companyId);
    return this.notes;
  }

  /**
   * Description: This method is used to resets forms and remove text area.
   * @description This method is used to resets forms and remove text area.
   * @param index This is index number of text area.
   */
  removeTextArea(index: any) {
    this.noteForm.reset();
    this.textAreasList.splice(index, 1);
  }

  /**
   * Description: This method is used to delete note by Id.
   * @description This method is used to delete note by Id.
   * @param noteId This is note Id of note.
   */
  async deleteNote(noteId: number) {
    await this.residentService.deleteNoteByNoteId(noteId);
    await this.getNotesByCompanyId(this.company.id);
    this.modalService.dismissAll();
  }

  /**
   * Description: This method is used to open model.
   * @description This method is used to open model.
   * @param content This is content.
   * @param modalSize This is size of model(xl,sm).
   */
  open(content: any, modalSize?: string) {
    const size = modalSize ? modalSize : 'xl';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop: 'static' });
  }

  onChangeCompanyStatus(companyStatus: number) {
    this.companyStatusChangeDateFlag = true;
    if (companyStatus == 1) {
      this.form.get('residencyStartDate')?.setValidators([Validators.required, DateValidators()]);
      this.form.controls.companyOnboarding.setValue(true);
      this.form.controls.companyVisibility.setValue(true);
      this.form.controls.committeeStatus.setValue(2);
    } else if (companyStatus == 4) {
      this.form.get('residencyStartDate')?.setValidators([Validators.required, DateValidators()]);
      this.form.get('residencyEndDate')?.setValidators([Validators.required, DateValidators()]);
      this.form.controls.companyOnboarding.setValue(true);
      this.form.controls.committeeStatus.setValue(2);
    } else {
      this.form.get('residencyStartDate')?.setValidators(null);
      this.form.get('residencyEndDate')?.setValidators(null);
    }
    this.form.get('residencyStartDate')?.updateValueAndValidity();
    this.form.get('residencyEndDate')?.updateValueAndValidity();
    this.form.get('companyOnboarding')?.updateValueAndValidity();
    this.form.get('companyVisibility')?.updateValueAndValidity();
    this.form.get('committeeStatus')?.updateValueAndValidity();
  }

  /**
   * Description: This method is used to patch the form for update.
   * @description This method is used to patch the form for update.
   * @param note This is note object.
   */
  editNotes(note: any) {
    this.noteForm.controls.id.patchValue(note.id);
    this.noteForm.controls.notes.patchValue(note.notes);
  }

  /**
   * Description: This method is used to update note.
   * @description This method is used to update note.
   */
  async updateNotes() {
    const obj = { companyId: this.company.id, ...this.noteForm.value };
    if (this.noteForm.valid && this.company && this.company.id) {
      (await this.residentService.updateNotes(obj)).subscribe(async res => {
        await this.getNotesByCompanyId(this.company.id);
        this.noteForm.reset();
        if (res.status == 'Success') {
          this.toastr.success(res.message, '', {
            timeOut: 3000,
            closeButton: true
          });
        } else {
          this.toastr.error(res.message, '', {
            timeOut: 3000,
            closeButton: true
          });
        }
      }, err => {
        console.error('error');
        this.toastr.error(CONFIG.ERROR_MSG.GET_NOTE, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
    }
  }

  formatParseDate(date: any) {

    const parserDate = date ? date.split('-') : null;

    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +

      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;

    return parsedDate;

  }
}
