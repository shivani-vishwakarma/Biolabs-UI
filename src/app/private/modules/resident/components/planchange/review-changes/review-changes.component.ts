import { AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResidentService } from 'src/app/core/services/resident.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONFIG } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-review-changes',
  templateUrl: './review-changes.component.html',
  styleUrls: ['./review-changes.component.css']
})
export class ReviewChangesComponent implements OnInit {

  @Input() step4 !: FormGroup;
  @Output() isSuccess = new EventEmitter<string>();
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  @ViewChild('thanksStep') thanksStep !: ElementRef<HTMLElement>;
  step1!: FormGroup;
  step2!: FormGroup;
  step3!: FormGroup;
  updateRequestLoader = false;
  globalDateFormat = environment.globalDateFormat;
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private residentService: ResidentService,
    private defaultDataService: DefaultDataService,
  ) { }

  ngOnInit(): void {
    this.step1 = this.step4.controls.step1 as FormGroup;
    this.step2 = this.step4.controls.step2 as FormGroup;
    this.step3 = this.step4.controls.step3 as FormGroup;
  }
  /**
   * Description : To iterate items for binding in html.
   * @description : To iterate items for binding in html.
   */
  getItemsListControls() {
    return (this.step1.controls.items as FormArray);
  }

  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }

  /**
   * Description : To save the space change waitlist record.
   * @description : To save the space change waitlist record.
   */
  submitRequest() {
    this.step2.value.funding = this.step2.value.funding ? +(this.step2.value.funding.replace(/,/g, '')) : '';
    const obj = { ...this.step1.value, ...this.step2.value, ...this.step3.value };
    obj.funding = Number(obj.funding);
    obj.desiredStartDate = obj.desiredStartDate ? this.formatParseDate(obj.desiredStartDate) : null;
    obj.desiredStartDate = obj.desiredStartDate ? this.datetimeFormate(new Date(obj.desiredStartDate)) : null;
    obj.fulfilledOn = 0;
    obj.membershipChange = parseFloat(obj.membershipChange);
    obj.requestGraduateDate = obj.requestGraduateDate ? this.formatParseDate(obj.requestGraduateDate) : null;
    obj.requestGraduateDate = obj.requestGraduateDate ? (this.datetimeFormate(new Date(obj.requestGraduateDate))) : null;
    if (obj.id) {
      obj.spaceChangeWaitlistId = obj.id;
      this.updateRequest(obj);
    } else {
      delete obj.id;
      this.addRequest(obj);
    }
  }

  /**
   * Description : To save the create change request.
   * @description : To save the create change request.
   * @param object this is waitlist object
   */
  addRequest(object: any) {
    this.updateRequestLoader = true;
    object.items.forEach((item: any) => {
      if (item.desiredQty == null) {
        item.desiredQty = item.currentQty;
      }
    });
    this.residentService.saveWaitListChangeRequest(object).subscribe(res => {
      if (res.status == 'Error') {
        this.toastr.error(res.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
      this.isSuccess.emit('true');
      setTimeout(() => {
        const element: HTMLElement = this.thanksStep.nativeElement;
        element.click();
      }, 100);
      this.updateRequestLoader = false;
    }, err => {
      this.updateRequestLoader = false;
      this.toastr.error('Something went wrong while saving Change Request.', '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  /**
   * Description : To update the create change request.
   * @description : To update the create change request.
   * @param object this is waitlist object
   */
  updateRequest(object: any) {
    this.updateRequestLoader = true;
    object.items.forEach((item: any) => {
      if (item.desiredQty == null) {
        item.desiredQty = item.currentQty;
      }
    });
    this.residentService.updateWaitListChangeRequest(object).subscribe(res => {
      if (res.status == 'Error') {
        this.toastr.error(res.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
      if (object.membershipChange == 1) {
        this.step2.addControl('shareYourProfile', new FormControl(true, Validators.required));
        this.step3.removeControl('shareYourProfile');
      }
      this.isSuccess.emit('true');
      // setTimeout(() => {
      //   const element: HTMLElement = this.thanksStep.nativeElement;
      //   element.click();
      // }, 100);
      this.updateRequestLoader = false;
      this.modalService.dismissAll();
      this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_CHANGE_REQ, '', {
        timeOut: 3000,
        closeButton: true
      });
    }, err => {
      this.updateRequestLoader = false;
      this.toastr.error(CONFIG.ERROR_MSG.UPDATE_CHANGE_REQ, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  onBackClick() {
    this.back.emit();
  }

  /**
   * Description : Remove timezone from date.
   * @description : Remove timezone from date.
   * @param date this is date
   */
  formatDate(date: any) {
    return (date) ? this.defaultDataService.dateWithoutTime(date) : '';
  }

  datetimeFormate(dt: any) {
    let dateUtc: any = new Date(Date.parse(dt));
    dateUtc = new Date(dateUtc.getTime() + Math.abs(dateUtc.getTimezoneOffset() * 60000));
    return (dateUtc / 1000);
  }

}
