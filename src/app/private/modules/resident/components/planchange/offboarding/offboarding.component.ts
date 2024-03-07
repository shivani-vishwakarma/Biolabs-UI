import { Input, Output, EventEmitter, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CONFIG, DateValidator, minDateValidator } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-off-boarding',
  templateUrl: './offboarding.component.html',
  styleUrls: ['./offboarding.component.css']
})
export class OffboardingComponent implements OnInit, AfterContentChecked {
  dateValid = true;
  @Input() step3 !: FormGroup;
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  minCalenderDate!: string;
  minCalDate: any = {};
  submitted = false;
  date: any;
  modelrequestGraduateDate: any;
  constructor(private dateAdapter: NgbDateAdapter<any>, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.minCalDate = {
      year: Number(new Date().getFullYear()),
      month: Number(new Date().getMonth() < 9 ? '0' : '') + (new Date().getMonth() + 1),
      day: Number(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()
    };
    this.step3.controls.shareYourProfile.setValue(true);
    const reqGraduateDate = this.step3.value.requestGraduateDate;
    const parsedReqGraduateDate = reqGraduateDate ? reqGraduateDate.split('-') : null;
    this.modelrequestGraduateDate = parsedReqGraduateDate ? this.dateAdapter.toModel({
      day: parsedReqGraduateDate[0],
      month: parsedReqGraduateDate[1],
      year: parsedReqGraduateDate[2]
    }) : null;
  }
  // html-(change)="onChange(step3.controls.requestGraduateDate)"
  // onChange(date: any) {
  //   const dateValue = date.value ? date.value.split('-') : null;
  //   const parsedDate: any = (dateValue && dateValue.length === 3) ? (dateValue[2] + '-' +
  //     (dateValue[1].length === 2 ? dateValue[1] : `0${dateValue[1]}`) + '-' +
  //     (dateValue[0].length === 2 ? dateValue[0] : `0${dateValue[0]}`)) : null;
  //   const value = this.datetimeFormate(parsedDate);
  //   const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  //   if (today >= value) {
  //     this.dateValid = false;
  //   } else {
  //     this.dateValid = true;
  //   }
  // }
  datetimeFormate(dt: any): any {
    let dateUtc: any = new Date(Date.parse(dt));
    dateUtc = new Date(dateUtc.getTime() + Math.abs(dateUtc.getTimezoneOffset() * 60000)).getTime();
    return (dateUtc);
  }
  ngAfterContentChecked(): void {
    // this.onChange(this.step3.controls.requestGraduateDate);
    // if (this.step3.controls.requestGraduateDate.value) {
    //   if (!this.dateValid) {
    //     this.step3.controls.requestGraduateDate.setErrors({ incorrect: true });
    //   } else {
    //     this.step3.controls.requestGraduateDate.setErrors(null);
    //   }
      this.cdref.detectChanges();
    // }
  }
  getItemsListControls() {
    return (this.step3.controls.items as FormArray);
  }
  formatParseDate(date: any) {
    const desiredDate: any = date;
    const parserDesiredDate = desiredDate ? desiredDate.split('-') : null;
    const parsedDesiredStartDate = parserDesiredDate ? (parserDesiredDate[2] + '-' +
      (parserDesiredDate[1].length === 2 ? parserDesiredDate[1] : `0${parserDesiredDate[1]}`) + '-' +
      (parserDesiredDate[0].length === 2 ? parserDesiredDate[0] : `0${parserDesiredDate[0]}`)) : null;
    return parsedDesiredStartDate;
  }
  stepThreeSubmit() {
    this.submitted = true;
    if (this.step3.invalid) {
      return;
    }
    if (this.step3.controls.requestGraduateDate.value) {
      const formattedDate = this.formatParseDate(this.step3.controls.requestGraduateDate.value);
      this.step3.value.formattedRequestGraduateDate = formattedDate;
      // this.step1.patchValue({ desiredStartDate: formattedDate })
    }
  }

  onNextClick() {
    this.next.emit();
  }

  onBackClick() {
    this.back.emit();
  }
}
