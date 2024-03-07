import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResidentService } from 'src/app/core/services/resident.service';
import { InvoiceWaitlistService } from 'src/app/private/modules/invoice-waitlist/services/invoice-waitlist.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CONFIG, GLOBAL, minDateValidator } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
// import { CONFIG, DateValidator, minDateValidator } from 'src/app/shared/utility/config.service';

const SPACE_CHANGE_WAITLIST_REQUESTNOTES_MAX_LEN = 600;
const WAITLIST_GRADUATE_DESCRIPTION_MAX_LEN = 500;
enum WaitingListStatus {
  open = 0,
  ApprovedInProgress = 1,
  ApprovedCompleted = 2,
  denied = 3,
  cancel = 4
}
@Component({
  selector: 'app-planchange',
  templateUrl: './planchange.component.html',
  styleUrls: ['./planchange.component.css']
})

export class PlanchangeComponent implements OnInit {
  @ViewChild('openModalBtn') openModalBtn !: ElementRef<HTMLElement>;
  closeResult: string | undefined;
  waitlistForm!: FormGroup;
  itemsList: any = [];
  step1!: FormGroup | any;
  step2!: FormGroup;
  step3!: FormGroup | any;
  isSuccess = false;
  openRequestsList: any[] = [];
  approvedAndDeniedList: any[] = [];
  currentStep = 1;
  isRequest = false;
  cancelRequestData: any = {};
  shareYourProfile = true;
  memberShipType = '0';
  currentPrivacy: any = false;
  globalDateFormat = environment.globalDateFormat;
  companyname: any = '';
  modelPlanStartDate: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private residentService: ResidentService,
    private activatedRoute: ActivatedRoute,
    private invoiceWaitlistService: InvoiceWaitlistService,
    private defaultDataService: DefaultDataService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private dateAdapter: NgbDateAdapter<any>
  ) {

  }

  ngOnInit(): void {
    this.getApprovedandDeninedWailList();
    this.getOpenedWailList();
    this.createWaitListForm();
    this.getDataOfCurrentResidentCompany();
    this.getSpaceChangeWaitListItems();
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
  /**
   * Description : Get items for approved and denined space change waitlist by companyId.
   * @description : Get items for approved and denined space change waitlist by companyId.
   * @param companyId this is company Id
   */
  private getApprovedandDeninedWailList() {
    if (this.activatedRoute.parent) {
      this.spinner.show();
      this.activatedRoute.parent.params.subscribe(params => {
        const ApprovedCompleted = 'ApprovedCompleted';
        const deniedtypekey = 'denied';
        this.invoiceWaitlistService.getWaitList([WaitingListStatus[ApprovedCompleted],
        WaitingListStatus[deniedtypekey]], params.id)
          .subscribe(res => {
            this.approvedAndDeniedList = res;
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            console.log('err', err);
          });
      });
    }
  }

  /**
   * Description : Get items for opened space change waitlist by companyId.
   * @description : Get items for opened space change waitlist by companyId.
   * @param companyId this is company Id
   */
  private getOpenedWailList() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        const opentypekey = 'open';
        const ApprovedInProgress = 'ApprovedInProgress';
        this.spinner.show();
        this.invoiceWaitlistService.getWaitList([WaitingListStatus[opentypekey], WaitingListStatus[ApprovedInProgress]], params.id)
          .subscribe(res => {
            this.openRequestsList = res;
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            console.log('err', err);
          });
      });
    }
  }

  /**
   * Description : Get data of current resident company.
   * @description : Get data of current resident company.
   */
  private getDataOfCurrentResidentCompany() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.spinner.show();
        this.residentService.getDetailsOfResidentCompanyByCompanyId(params.id).subscribe(res => {
          this.spinner.hide();
          this.step2.controls.residentCompanyId.setValue(params.id);
          this.step2.controls.companySize.setValue(res.TotalCompanySize);
          this.step2.controls.companyStage.setValue(res.companyStageOfDevelopment);
          this.step2.controls.funding.setValue(parseFloat(res.fundingToDate));
          this.step2.controls.fundingSource.setValue(res.fundingSource);
          this.step2.controls.funding.setValue(res.fundingToDate);
          this.currentPrivacy = res.canWeShareYourDataWithSponsorsEtc;
          this.companyname = res.company;
          this.shareYourProfile = res.canWeShareYourDataWithSponsorsEtc == null ||
            res.canWeShareYourDataWithSponsorsEtc == false ? false : true;
          if (this.memberShipType == '0') {
            this.step2.controls.shareYourProfile.setValue(this.shareYourProfile);
          } else {
            this.step3.controls.shareYourProfile.setValue(this.shareYourProfile);
          }
        }, err => {
          this.spinner.hide();
          console.log('err', err);
          if (err.statusCode == 406) {
            this.router.navigate(['/error'], { queryParams: {} });
          }
        });
      });
    }
  }

  /**
   * Description : Create Waitlist form for change request.
   * @description : Create waitlist form for change request.
   */
  private createWaitListForm() {
    this.waitlistForm = this.fb.group({
      step1: this.fb.group({
        id: [null],
        requestStatus: [0],
        isRequestInternal: [true],
        membershipChange: ['0', [Validators.required]],
        desiredStartDate: ['', [Validators.required, minDateValidator()]],
        items: this.fb.array([]),
        requestNotes: ['', [Validators.required, Validators.maxLength(SPACE_CHANGE_WAITLIST_REQUESTNOTES_MAX_LEN)]],
        planChangeSummary: [''],
        fulfilledOn: [0],
        siteNotes: ['']
      }),
      step2: this.fb.group({
        residentCompanyId: ['', [Validators.required]],
        companyStage: ['', [Validators.required]],
        companySize: ['', [Validators.required, Validators.min(1)]],
        funding: ['', [Validators.required, Validators.min(0)]],
        fundingSource: ['', [Validators.required, Validators.minLength(1)]],
        internalNotes: [''],
        shareYourProfile: ['']
      }),
      step3: this.fb.group({
        requestGraduateDate: ['', [Validators.required, minDateValidator()]],
        marketPlace: [null, [Validators.required]],
        graduateDescription: ['', [Validators.maxLength(WAITLIST_GRADUATE_DESCRIPTION_MAX_LEN)]],
      })
    });
    this.step1 = this.waitlistForm.controls.step1 as FormGroup;
    this.step2 = this.waitlistForm.controls.step2 as FormGroup;
    this.step3 = this.waitlistForm.controls.step3 as FormGroup;
    this.step1.controls.membershipChange.valueChanges.subscribe({
      next: (value: any) => {
        if (value == 0) {
          this.reArrangeFormArray();
          this.memberShipType = '0';
          this.step3.removeControl('shareYourProfile');
          this.step2.addControl('shareYourProfile', new FormControl(this.shareYourProfile, Validators.required));
          this.step1.controls.desiredStartDate.setValidators([Validators.required, minDateValidator()]);
          this.step1.controls.requestNotes
            .setValidators([Validators.required, Validators.maxLength(SPACE_CHANGE_WAITLIST_REQUESTNOTES_MAX_LEN)]);
          this.step1.controls.desiredStartDate.updateValueAndValidity();
          this.step1.controls.requestNotes.updateValueAndValidity();
        }
        if (value == 1) {
          this.resetFormArray();
          this.memberShipType = '1';
          this.step2.removeControl('shareYourProfile');
          this.step3.addControl('shareYourProfile', new FormControl(this.shareYourProfile, Validators.required));
          this.step1.controls.desiredStartDate.setValidators(null);
          this.step1.controls.requestNotes.setValidators(null);
          this.step1.controls.desiredStartDate.updateValueAndValidity();
          this.step1.controls.requestNotes.updateValueAndValidity();
        }
      }
    });
  }

  /**
   * Description : Get items of current resident company.
   * @description : Get items of current resident company.
   */
  private getSpaceChangeWaitListItems() {
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.spinner.show();
        this.residentService.getSpaceChangeWaitListItems(params.id).subscribe(res => {
          this.spinner.hide();
          this.itemsList = res.items;
          const add = this.step1.get('items') as FormArray;
          this.clearFormArray(add);
          for (const item of res.items) {
            add.push(this.fb.group({
              itemName: [item.productTypeName],
              currentQty: [parseFloat(item.sum)],
              productTypeId: [item.productTypeId],
              desiredQty: [null]
            }));
          }
        }, err => {
          this.spinner.hide();
          console.log('err', err);
          if (err.statusCode == 406) {
            this.router.navigate(['/error'], { queryParams: {} });
          }
        });
      });
    }
  }

  open(content: any, modalSize?: string) {
    const size = modalSize ? modalSize : 'xl';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * Description : Clear the formArray.
   * @description : Clear the formArray.
   * @param formArray this is formArray
   */
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getDismissReason(reason: any): string {
    this.currentStep = 1;
    this.waitlistForm.reset();
    this.createWaitListForm();
    this.getDataOfCurrentResidentCompany();
    this.getSpaceChangeWaitListItems();
    this.memberShipType = '0';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Description : To convert the milliseconds to date format.
   * @description : To convert the milliseconds to date format.
   * @param desiredDate this is date as Milliseconds
   */
  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }

  /**
   * Description  : It trigger from child for controlling thank you page.
   * @description : It trigger from child for controlling thank you page.
   * @param event this is event
   */
  successFeedBack(event: any) {
    this.isSuccess = event == 'true' ? true : false;
    this.refresh();
    // this.createWaitListForm();
  }

  /**
   * Description  : Refresh data.
   * @description : Refresh data.
   */
  refresh() {
    this.getApprovedandDeninedWailList();
    this.getOpenedWailList();
    this.memberShipType = '0';
  }

  onNextClick() {
    if (this.step1 && this.step1.value) {
      this.step1.value.planChangeSummary = this.step1.value.items.map(({ itemName, desiredQty, currentQty }: any) => {
        const caculation = desiredQty - currentQty;
        if ((desiredQty || desiredQty == 0) && !!(desiredQty - currentQty)) {
          return `${caculation > 0 ? '+' + caculation : caculation} ${itemName}`;
        }
        return null;
      }).filter((el: any) => el != null).toString();
    }
    const validation = {
      typeUpdateStep1: this.currentStep == 1 && this.waitlistForm.value[`step${this.currentStep}`].desiredStartDate != ''
        && this.waitlistForm.value[`step${this.currentStep}`].requestNotes.trim() != '',
      typeUpdateStep2: (this.currentStep == 2 && this.waitlistForm.value[`step${this.currentStep}`].companySize > 0)
        || (this.currentStep == 3 && this.memberShipType == '0'),
      typeGraduateStep1: this.memberShipType == '1' && this.currentStep == 1,
      typeGraduateStep2: (this.step3.value.companySize) && this.memberShipType == '1' && this.currentStep == 2,
      typeGraduateStep3: (this.step3.value.marketPlace != null && this.step3.value.requestGraduateDate &&
        this.step3.value.graduateDescription.length <= WAITLIST_GRADUATE_DESCRIPTION_MAX_LEN)
        && this.memberShipType == '1' && this.currentStep == 3,
    };

    if (validation.typeGraduateStep3) {
      this.currentStep++;
      return;
    }

    if (validation.typeGraduateStep2) {
      this.currentStep++;
      return;
    }

    if (validation.typeGraduateStep1) {
      this.currentStep++;
      return;
    }

    if (validation.typeUpdateStep1) {
      this.currentStep++;
      return;
    }

    if (validation.typeUpdateStep2) {
      this.currentStep++;
      return;
    }
    return;
  }

  onBackClick() {
    this.currentStep--;
  }

  /**
   * Description : To show the items with quantity in html.
   * @description : To show the items with quantity in html.
   * @param items this is items array
   */
  showWaitlistQty(items: any[]) {
    let tags = '';
    const itemsArray = items.filter(item => item.desiredQty != null && (item.desiredQty - item.currentQty) != 0);
    for (let item = 0; item < itemsArray.length; item++) {
      if (itemsArray[item].desiredQty - itemsArray[item].currentQty >= 1) {
        tags += '+';
      }
      tags += itemsArray[item].desiredQty - itemsArray[item].currentQty + ' ' + itemsArray[item].itemName;
      if (Number(item) < itemsArray?.length - 1) {
        tags += ', ' + '<br>';
      }
    }
    return tags;
  }

  /**
   * Description : To assign waitlist object for display on modal along with cancel button.
   * @description : To assign waitlist object for display on modal along with cancel button.
   * @param changeRequest this is waitlist object
   */
  public cancelRequest(changeRequest: any) {
    changeRequest.shareYourProfile = this.currentPrivacy;
    this.cancelRequestData = changeRequest;
  }

  /**
   * Description : Submit cancel request.
   * @description : Submit cancel request.
   */
  public submitCancelRequest() {
    const cancelStatus = 'cancel';
    this.residentService.updateWaitListChangeRequestStatus({ id: this.cancelRequestData.id, status: WaitingListStatus[cancelStatus] })
      .subscribe(res => {
        this.refresh();
        if (res.status == 'Success') {
          this.toastr.success(CONFIG.SUCCESS_MSG.CANCEL_REQUEST, '', {
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
        this.toastr.error(CONFIG.ERROR_MSG.SAVE_CHANGE_REQUEST, '', {
          timeOut: 3000,
          closeButton: true
        });
      });
  }

  /**
   * Description : To populate the prefilled data on create change request modal.
   * @description : To populate the prefilled data on create change request modal.
   * @param changeRequest this is waitlist object
   */
  public editChangeRequest(changeRequest: any) {
    const date = new Date(changeRequest.desiredStartDate * 1000);
    let reqdate = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') +
      (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
    const parserReqDate = reqdate ? reqdate.split('-') : null;
    reqdate = parserReqDate ? this.dateAdapter.toModel({
      day: Number(parserReqDate[2]),
      month: Number(parserReqDate[1]),
      year: Number(parserReqDate[0])
    }) : null;
    this.step1.controls.id.patchValue(changeRequest.id);
    this.step1.controls.requestStatus.patchValue(changeRequest.requestStatus);
    this.step1.controls.isRequestInternal.patchValue(changeRequest.isRequestInternal);
    this.step1.controls.membershipChange.patchValue(changeRequest.membershipChange + '');
    if (changeRequest.membershipChange == 0) {
      this.step1.controls.desiredStartDate.patchValue(reqdate);
      this.step1.controls.desiredStartDate.setValidators([Validators.required, minDateValidator()]);
      this.step1.controls.desiredStartDate.updateValueAndValidity();
      this.step1.controls.requestNotes.patchValue(changeRequest.requestNotes);
      const itemadd = this.step1.get('items') as FormArray;
      this.clearFormArray(itemadd);
      for (const item of changeRequest.items) {
        itemadd.push(this.fb.group({
          id: [item.id],
          spaceChangeWaitlist_id: [item.spaceChangeWaitlist_id],
          createdAt: [item.createdAt],
          itemName: [item.itemName],
          currentQty: [item.currentQty],
          productTypeId: [item.productTypeId],
          desiredQty: [item.desiredQty == item.currentQty ? null : item.desiredQty],
          updatedAt: [item.updatedAt]
        }));
      }
    } else {
      const graduateddate = new Date(changeRequest.requestGraduateDate * 1000);
      let graduatedate = graduateddate.getFullYear() + '-' + (graduateddate.getMonth() < 9 ? '0' : '') +
        (graduateddate.getMonth() + 1) + '-' + (graduateddate.getDate() < 10 ? '0' : '') + graduateddate.getDate();
      const parserGraduateReqDate = graduatedate ? graduatedate.split('-') : null;
      graduatedate = parserGraduateReqDate ? this.dateAdapter.toModel({
        day: Number(parserGraduateReqDate[2]),
        month: Number(parserGraduateReqDate[1]),
        year: Number(parserGraduateReqDate[0])
      }) : null;
      this.step3.controls.requestGraduateDate.patchValue(graduatedate);
      this.step3.controls.requestGraduateDate.setValidators([Validators.required, minDateValidator()]);
      this.step3.controls.graduateDescription.patchValue(changeRequest.graduateDescription);
      this.step3.controls.marketPlace.patchValue(changeRequest.marketPlace);
      this.step1.controls.desiredStartDate.setValidators(null);
      this.step1.controls.requestNotes.setValidators(null);
      this.step1.controls.desiredStartDate.updateValueAndValidity();
      this.step1.controls.requestNotes.updateValueAndValidity();
    }

    this.step1.controls.planChangeSummary.patchValue(changeRequest.planChangeSummary);
    this.step1.controls.fulfilledOn.patchValue(changeRequest.fulfilledOn);
    this.step1.controls.siteNotes.setValue(changeRequest.siteNotes);
    this.getDataOfCurrentResidentCompany();
    const element: HTMLElement = this.openModalBtn.nativeElement;
    element.click();
  }

  /**
   * Description : Reset the formArray.
   * @description : Reset the formArray.
   */
  resetFormArray() {
    const itemsArr: any = (this.step1.get('items') as FormArray).controls;
    for (const item of itemsArr) {
      item.controls.desiredQty.reset();
    }
  }

  /**
   * Description : Re arrange the formArray.
   * @description : Re arrange the formArray.
   */
  reArrangeFormArray() {
    const itemsArr: any = (this.step1.get('items') as FormArray).controls;
    for (const item of itemsArr) {
      item.controls.desiredQty.patchValue(item.controls.currentQty.value);
    }
  }
}
