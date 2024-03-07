import { DatePipe } from '@angular/common';
import { Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CONFIG, DateValidator, minDateValidator } from 'src/app/shared/utility/config.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-membership-changes',
  templateUrl: './membership-changes.component.html',
  styleUrls: ['./membership-changes.component.css']
})
export class MembershipChangesComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  minCalenderDate!: string;
  modelDesiredStartDate: any;
  minCalDate: any = {};
  submitted = false;
  dateValid = true;
  @Input() step1 !: FormGroup | any;
  @Output() next = new EventEmitter();
  @Input() type: any;
  date: any;


  constructor(
    public dateAdapter: NgbDateAdapter<any>, private cdref: ChangeDetectorRef,
    private defaultDataService: DefaultDataService,
    private datepipe: DatePipe) {

  }

  ngOnInit(): void {
    const desiredStartDateVal = this.step1.controls.desiredStartDate.value;
    const parserDesiredStartDate = desiredStartDateVal ? desiredStartDateVal.split('-') : null;
    if (parserDesiredStartDate && parserDesiredStartDate.length && parserDesiredStartDate[0]) {
      this.modelDesiredStartDate = this.dateAdapter.toModel({
        year: Number(parserDesiredStartDate[2]),
        month: Number(parserDesiredStartDate[1]), day: Number(parserDesiredStartDate[0])
      });
    }
    this.minCalDate = {
      year: Number(new Date().getFullYear()),
      month: Number((new Date().getMonth() < 9 ? '0' : '') + (new Date().getMonth() + 1)),
      day: Number((new Date().getDate() < 10 ? '0' : '') + new Date().getDate())
    };
  }
  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }

  ngAfterContentChecked(): void {
      this.cdref.detectChanges();
    // }
  }


  /**
   * Description  : To iterate items for binding in html.
   * @description : To iterate items for binding in html.
   */
  getItemsListControls() {
    return (this.step1.controls.items as FormArray);
  }

  formatParseDate(date: any) {
    const desiredDate: any = date;
    const parserDesiredDate = desiredDate ? desiredDate.split('-') : null;
    const parsedDesiredStartDate = parserDesiredDate ? (parserDesiredDate[2] + '-' +
      (parserDesiredDate[1].length === 2 ? parserDesiredDate[1] : `0${parserDesiredDate[1]}`) + '-' +
      (parserDesiredDate[0].length === 2 ? parserDesiredDate[0] : `0${parserDesiredDate[0]}`)) : null;
    return parsedDesiredStartDate;
  }

  /**
   * Description  : Submit for step1.
   * @description : Submit for step1.
   */
  stepOneSubmit() {
    this.submitted = true;
    if (this.step1.invalid) {
      return;
    }
    if (this.step1.controls.desiredStartDate.value) {
      const formattedDate = this.formatParseDate(this.step1.controls.desiredStartDate.value);
      this.step1.value.formattedDesiredStartDate = formattedDate;
    }
  }

  onNextClick() {
    this.next.emit();
  }
}
