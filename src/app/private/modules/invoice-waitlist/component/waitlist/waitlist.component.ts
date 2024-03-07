import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateAdapter, NgbDatepicker, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DatePipe, formatDate } from '@angular/common';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { InvoiceWaitlistService } from '../../services/invoice-waitlist.service';
import { environment } from 'src/environments/environment';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { APPLICATION_STATUS, COMPANY_STATUS, CONFIG, GLOBAL, ROLE } from 'src/app/shared/utility/config.service';
import { ToastrService } from 'ngx-toastr';


/**
 * Description: Enum for waiting list status.
 * @description Enum for waiting list status.
 */
enum WaitingListStatus {
  Open = 0,
  ApprovedInProgress = 1,
  ApprovedCompleted = 2,
  Denied = 3,
  Cancelled = 4
}

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {

  openRequest = new FormGroup({
    residentCompanyName: new FormControl(''),
    planChangeSummary: new FormControl(''),
    requestedType: new FormControl(''),
    requestStatus: new FormControl(''),
    siteNotes: new FormControl('', [Validators.maxLength(500)]),
    desiredStartDate: new FormControl(''),
    requestedBy: new FormControl(''),
    requestNotes: new FormControl(''),
    fulfilledOn: new FormControl(),
    internalNotes: new FormControl('', [Validators.maxLength(500)]),
  });
  modelFulfilledOn: any;
  minCalDate: any;
  openRequestsList: any[] = [];
  planChangeSummaryItems: any[] = [];
  approvedAndDeniedList: any[] = [];
  selectedRequest: any;
  productsType: any[] = [];
  companyStatusType: any[] = [];
  requestTypes: string[] = ['Approved-Completed', 'Denied'];
  selecteProductType = '';
  selectCompanyStatusType: any;
  selectedRequestedType = '';
  minCalenderDate!: string;
  segment!: string;
  closeResult: string | undefined;
  requestTypeToggle = {
    open: true,
    completed: false
  };
  selectedOpenRequest: any;
  updateRequestLoader = false;
  globalDateFormat = environment.globalDateFormat;
  @ViewChild('highligter') highligter !: ElementRef<HTMLElement>;
  // @ViewChild(NgbDatepicker) ngbDatepicker: any;
  @ViewChild('NgbdDatepicker') d5: any;

  constructor(
    private waitlistService: InvoiceWaitlistService, private spinner: NgxSpinnerService,
    private modalService: NgbModal, private configurationService: ConfigurationService,
    private residentService: ResidentService, public formBuilder: FormBuilder,
    private toastr: ToastrService, public defaultDataService: DefaultDataService,
    public datepipe: DatePipe,
    private dateAdapter: NgbDateAdapter<any>) {
  }

  filterForm = this.formBuilder.group({
    productName: [''],
    requestTypes: [''],
    companyStatus: ['']
  });

  ngOnInit() {
    this.getOpenspaceChangeWaitlist();
    this.getAcceptAndDeniedSpacechangeWaitlist();
    this.getProductType();
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  hideDrag() {
    if ((this.getRole() == ROLE.SUPER_ADMIN) || (this.getRole() == ROLE.SITE_ADMIN)) {
      return false;
    }
    return true;
  }
  /**
   * Description: This method set drop event to open request list.
   * @description This method set drop event to open request list.
   * @param event event of type CdkDragDrop.
   */
  openRequestsListDrop(event: CdkDragDrop<string[]>) {
    if ((this.getRole() == ROLE.SUPER_ADMIN) || (this.getRole() == ROLE.SITE_ADMIN)) {
      moveItemInArray(this.openRequestsList, event.previousIndex, event.currentIndex);
      const openRequestsListId = this.openRequestsList.map(({ id }) => {
        return id;
      });
      this.updateWaitList(openRequestsListId);
    }
  }

  /**
   * Description: This method get open spacechange waitlist and modifed to appends the property itemsNamesToString.
   * @description This method get open spacechange waitlist and modifed to appends the property itemsNamesToString.
   */
  getOpenspaceChangeWaitlist() {
    const opentypekey = 'Open';
    const approvedInProgresskey = 'ApprovedInProgress';
    this.spinner.show();
    this.waitlistService.getWaitList([WaitingListStatus[opentypekey], WaitingListStatus[approvedInProgresskey]])
      .subscribe((res) => {
        const list = res.map((item: any) => {
          return this.modifyItem(item);
        });
        this.openRequestsList = list;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log('ERROR', err);
      });
  }

  /**
   * Description: This method  get accept and denied spacechange waitlist and modifed to appends the property itemsNamesToString.
   * @description This method  get accept and denied spacechange waitlist and modifed to appends the property itemsNamesToString.
   */
  getAcceptAndDeniedSpacechangeWaitlist() {
    const approvedCompletedtypekey = 'ApprovedCompleted';
    const deniedtypekey = 'Denied';
    this.spinner.show();
    this.waitlistService.getWaitList([WaitingListStatus[approvedCompletedtypekey], WaitingListStatus[deniedtypekey]])
      .subscribe((res) => {
        const list = res.map((item: any) => {
          return this.modifyItem(item);
        });
        this.approvedAndDeniedList = list;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log('ERROR', err);
      });
  }

  /**
   * Description: Used to convert millisecond into date and and generates comma seperated item text.
   * @description Used to convert millisecond into date and and generates comma seperated item text.
   * @param item list item
   */
  private modifyItem(item: any) {
    item.desiredStartDate = item.desiredStartDate ? item.desiredStartDate * 1000 : '';
    item.fulfilledOn = item.fulfilledOn ? item.fulfilledOn * 1000 : '';
    item.requestGraduateDate = item.requestGraduateDate ? new Date(item.requestGraduateDate * 1000) : '';
    item.itemsNamesToString = item.items.map(({ itemName, desiredQty, currentQty }: any) => {
      const caculation = desiredQty - currentQty;
      if (desiredQty && !!(desiredQty - currentQty)) {
        return `${caculation > 0 ? '+' + caculation : caculation} ${itemName}`;
      }
      return null;
    }).filter((el: any) => el != null).toString();
    return item;
  }

  /**
   * Description: This method update's Wait List.
   * @description This method update's Wait List.
   * @param openRequestsListId Array of update Wait List.
   */
  updateWaitList(openRequestsListId: any) {
    this.waitlistService.updateWaitList(openRequestsListId).subscribe(() => { }, err => console.log('error', err));
  }

  /**
   * Description: This Calculate the DesiredQty minus CurrentQty
   * @description This Calculate the DesiredQty minus CurrentQty
   * @param desiredqty Desired Quantity.
   * @param currqty Current Quantity.
   * @param itemName item Name.
   * @param itemLength total items.
   * @param index Current index.
   */
  caculateDesiredQut(desiredqty: any, currqty: number, itemName: string, itemLength: number, index: number) {
    if (desiredqty && !!(desiredqty - currqty)) {
      let requestBuilder = (desiredqty - currqty) > 0 ? '+' + (desiredqty - currqty) : (desiredqty - currqty);
      requestBuilder = requestBuilder + ' ' + itemName;
      return requestBuilder;
    }
    return '';
  }

  /**
   * Description: This method get product types
   * @description This method get product types
   */
  getProductType() {
    this.configurationService.getProductsType().subscribe(res => {
      const filterProducts = res.filter((item: any) => {
        return item.id != 6 && item.id != 7;
      });
      this.productsType = filterProducts;
    });
  }

  /**
   * Description: This method triggers on select
   * @description This method triggers on select
   * @param event Type Event
   */
  onProductTypeChange(event: any) {
    this.selecteProductType = event.target.value;
    // this.hasClass();
  }

  /**
   * Description: This method triggers on select to get approved or denied
   * @description This method triggers on select to get approved or denied
   * @param event Type Event
   */
  onRequestTypeChange(event: any) {
    const requestType = event.target.value;
    if (requestType == 'Denied') {
      this.getWaitListByRequestType('Denied');
    } else if (requestType == 'Approved-Completed') {
      this.getWaitListByRequestType('ApprovedCompleted');
    } else {
      this.getAcceptAndDeniedSpacechangeWaitlist();
    }
  }

  /**
   * Description: This method  get open spacechange waitlist and modifed to appends the property itemsNamesToString.
   * @description This method  get open spacechange waitlist and modifed to appends the property itemsNamesToString.
   */
  private getWaitListByRequestType(requestType: any) {
    this.spinner.show();
    this.waitlistService.getWaitList([WaitingListStatus[requestType]])
      .subscribe((res) => {
        const list = res.map((item: any) => {
          return this.modifyItem(item);
        });
        this.approvedAndDeniedList = [];
        this.approvedAndDeniedList = list;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log('ERROR', err);
      });
  }

  /**
   * Description: This method highlights Product Type
   * @description This method highlights Product Type
   * @param productType Product Type
   */
  highlightsProductType(productType: string) {
    if (this.selecteProductType == productType) {
      // this.hasClass(); // This is used to highlight the row.
      return true;
    }
    return false;
  }

  /**
   * Description : open method invokes on model open.
   * @description : open method invokes on model open.
   * @param content context type any.
   * @param selectedRequest selected Request.
   * @param modalSize size of the modal.
   */
  open(content: any, selectedRequest: string, modalSize?: string) {
    if ((this.getRole() == ROLE.SUPER_ADMIN) || (this.getRole() == ROLE.SITE_ADMIN)) {
      this.openRequest.reset();
      this.selectedOpenRequest = selectedRequest;
      const parserSelectedFulfilledOn = this.selectedOpenRequest?.fulfilledOn ? formatDate(this.selectedOpenRequest?.fulfilledOn, 'yyyy-MM-dd', 'en') : null;
      const parsedSelectedFulfilledOn = parserSelectedFulfilledOn ? parserSelectedFulfilledOn.split('-') : null;
      this.selectedOpenRequest.requestGraduateDate = this.formatDate(this.selectedOpenRequest.requestGraduateDate);
      const selectedOpenRequest = {
        residentCompanyName: this.selectedOpenRequest?.residentCompanyName,
        planChangeSummary: this.selectedOpenRequest?.planChangeSummary,
        requestedType: this.selectedOpenRequest?.isRequestInternal ? 'Internal' : 'External',
        desiredStartDate: this.selectedOpenRequest?.desiredStartDate ? this.selectedOpenRequest?.desiredStartDate : '',
        requestedBy: `${this.selectedOpenRequest?.firstName} ${this.selectedOpenRequest?.lastName}`,
        requestNotes: this.selectedOpenRequest?.requestNotes,
        siteNotes: this.selectedOpenRequest?.siteNotes,
        internalNotes: this.selectedOpenRequest.internalNotes,
        fulfilledOn: parsedSelectedFulfilledOn ? this.dateAdapter.toModel({
          day: Number(parsedSelectedFulfilledOn[2]),
          month: Number(parsedSelectedFulfilledOn[1]),
          year: Number(parsedSelectedFulfilledOn[0]),
        }) : null,
        // fulfilledOn: this.selectedOpenRequest?.fulfilledOn ? formatDate(this.selectedOpenRequest?.fulfilledOn, 'yyyy-MM-dd', 'en') : ''
      };
      this.openRequest.patchValue({ ...selectedOpenRequest });
      this.modelFulfilledOn = parsedSelectedFulfilledOn ? this.dateAdapter.toModel({
        day: Number(parsedSelectedFulfilledOn[2]),
        month: Number(parsedSelectedFulfilledOn[1]),
        year: Number(parsedSelectedFulfilledOn[0])
      }) : null;
      const size = modalSize ? modalSize : 'xl';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Description: This method invoke on wait list click event.
   * @description This method invoke on wait list click event.
   */
  onSubmit() {
    if (this.openRequest.valid) {
      if (this.openRequest.value.requestStatus == 'Open') {
        this.openRequest.value.requestStatus = 0;
      } else if (this.openRequest.value.requestStatus == 'Approved- In Progress') {
        this.openRequest.value.requestStatus = 1;
      } else if (this.openRequest.value.requestStatus == 'Approved-Completed') {
        this.openRequest.value.requestStatus = 2;
      } else if (this.openRequest.value.requestStatus == 'Denied') {
        this.openRequest.value.requestStatus = 3;
      } else {
        this.openRequest.value.requestStatus = this.selectedOpenRequest.requestStatus;
      }
      this.updateRequest();
    }
  }

  private updateRequest() {
    const updatedRequest = { ...this.selectedOpenRequest, ...this.openRequest.value };
    updatedRequest.spaceChangeWaitlistId = updatedRequest.id;
    updatedRequest.dateRequested = this.defaultDataService.dateWithoutTime(updatedRequest.dateRequested);
    updatedRequest.dateRequested = (Date.parse(updatedRequest.dateRequested) / 1000);
    updatedRequest.requestGraduateDate = updatedRequest.requestGraduateDate ?
      new Date(updatedRequest.requestGraduateDate).getTime() / 1000 : null;
    updatedRequest.desiredStartDate = updatedRequest.desiredStartDate / 1000;
    // updatedRequest.fulfilledOn = this.datetimeFormate(updatedRequest.fulfilledOn);
    this.updateRequestLoader = true;
    updatedRequest.requestNotes = updatedRequest.requestNotes ? updatedRequest.requestNotes : '';
    updatedRequest.graduateDescription = updatedRequest.graduateDescription ? updatedRequest.graduateDescription : '';
    const updatedReqFulfilledOn = updatedRequest.fulfilledOn;
    const parsedUpdatedReqFulfilledOn = updatedReqFulfilledOn ? updatedReqFulfilledOn.split('-') : null;
    updatedRequest.fulfilledOn = parsedUpdatedReqFulfilledOn ? parsedUpdatedReqFulfilledOn[2] + '-' +
      (parsedUpdatedReqFulfilledOn[1].length === 2 ? parsedUpdatedReqFulfilledOn[1] : `0${parsedUpdatedReqFulfilledOn[1]}`) +
      '-' + (parsedUpdatedReqFulfilledOn[0].length === 2 ? parsedUpdatedReqFulfilledOn[0] : `0${parsedUpdatedReqFulfilledOn[0]}`) : null;
    updatedRequest.fulfilledOn = this.datetimeFormate(updatedRequest.fulfilledOn);
    this.residentService.getDetailsOfResidentCompanyByCompanyId(this.selectedOpenRequest.residentCompanyId)
      .subscribe(companyDetailres => {
        updatedRequest.companyStage = companyDetailres.companyStageOfDevelopment;
        updatedRequest.fundingSource = companyDetailres.fundingSource;
        updatedRequest.funding = +companyDetailres.fundingToDate;
        updatedRequest.shareYourProfile = companyDetailres.canWeShareYourDataWithSponsorsEtc;
        this.residentService.updateWaitListChangeRequest(updatedRequest).subscribe(udpateWailListres => {
          this.getOpenspaceChangeWaitlist();
          this.getAcceptAndDeniedSpacechangeWaitlist();
          this.modalService.dismissAll();
          this.updateRequestLoader = false;
          this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_CHANGE_REQ, '', {
            timeOut: 3000,
            closeButton: true
          });
        }, err => {
          console.log('ERROR:', err);
          this.updateRequestLoader = false;
          this.modalService.dismissAll();
          this.toastr.error(CONFIG.ERROR_MSG.UPDATE_CHANGE_REQ, '', {
            timeOut: 3000,
            closeButton: true
          });
        });
      }, err => {
        this.toastr.error(CONFIG.ERROR_MSG.GET_COMPANY_DETAILS, '', {
          timeOut: 3000,
          closeButton: true
        });
        console.log(CONFIG.ERROR_MSG.GET_COMPANY_DETAILS, err);
        this.updateRequestLoader = false;
      });
  }

  /**
   * Description: This method change the state of RequestType Toggle By clicking on it.
   * @description This method change the state of RequestType Toggle By clicking on it.
   */
  onRequestTypeToggle() {
    this.requestTypeToggle.open = !this.requestTypeToggle.open;
    this.requestTypeToggle.completed = !this.requestTypeToggle.completed;
  }

  /**
   * Description: remove timeZone from Date.
   * @param dt date in string
   * @returns returns the date in milliseconds of current timezone
   */
  datetimeFormate(dt: any) {
    let dateUtc: any = new Date(Date.parse(dt));
    dateUtc = new Date(dateUtc.getTime() + Math.abs(dateUtc.getTimezoneOffset() * 60000));
    return (dateUtc / 1000);
  }

  /**
   * Description: Returns string format of company status, like: Current Member, Applied-New etc.
   * @description Returns string format of company status, like: Current Member, Applied-New etc.
   * @param companyIdStatus numeric value of company status
   * @returns string value of company status
   */
  getCompanyStatus(companyIdStatus: number) {
    return APPLICATION_STATUS[+companyIdStatus];
  }

  /**
   * Description: This method highlights companyStatus Type
   * @description This method highlights companyStatus Type
   * @param productType companyStatus Type
   */
  highlightsCompanyStatus(companyStatus: number): boolean {
    if (this.selectCompanyStatusType == companyStatus) {
      // this.hasClass(); // This is used to highlight the row.
      return true;
    }
    return false;
  }

  /**
   * Description: This method triggers on select
   * @description This method triggers on select
   * @param event Type Event
   */
  onCompanyStatusChange(event: any) {
    this.selectCompanyStatusType = event.target.value;
  }

  /**
   * Description: This checks the presents of class
   * @description This checks the presents of class
   */
  checkSelectedRequest(openRequest: any) {
    let isSelected = false;
    if (this.selecteProductType && this.selecteProductType != 'none' &&
      this.selectCompanyStatusType && this.selectCompanyStatusType != '') {
      for (const item of openRequest.items) {
        if (item.itemName == this.selecteProductType &&
          item.desiredQty && !!(item.desiredQty - item.currentQty &&
            openRequest.companyStatus == this.selectCompanyStatusType)) {
          isSelected = true;
          break;
        }
      }
    }
    else if (this.selecteProductType && this.selecteProductType != 'none') {
      for (const item of openRequest?.items) {
        if (item.itemName == this.selecteProductType && item.desiredQty &&
          !!(item.desiredQty - item.currentQty)) {
          isSelected = true;
          break;
        }
      }
    }
    else if (this.selectCompanyStatusType && this.selectCompanyStatusType != '') {
      if (openRequest.companyStatus == this.selectCompanyStatusType) {
        isSelected = true;
      }
    }
    return isSelected;
  }
}
