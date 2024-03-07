import { Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { DefaultDataService, inputDollarMasking } from 'src/app/shared/service/default-data.service';
import { TreeviewItem } from 'ngx-treeview';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-company-updates',
  templateUrl: './company-updates.component.html',
  styleUrls: ['./company-updates.component.css']
})
export class CompanyUpdatesComponent implements OnInit {
  numberMask = inputDollarMasking;
  buttonClass = '';
  @Input() step2 !: FormGroup;
  @Input() type: any;
  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();
  privacy = false;
  companyStageOptions: any;
  fundingSourceOption: any;
  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
    hasDivider: false
  };
  fundingList: any;
  submitted = false;

  constructor(
    private defaultData: DefaultDataService
  ) { }

  ngOnInit(): void {
    this.getCompanyStage();
    this.getFundingOptions();
    if (this.type == '0') {
      this.privacy = this.step2.controls.shareYourProfile.value;
      this.step2.controls.shareYourProfile.setValue(true);
    }
  }

  /**
   * Description : Get company stages from default data.
   * @description : Get company stages from default data.
   */
  async getCompanyStage() {
    this.companyStageOptions = await this.defaultData.getCompanyStage();
    return this.companyStageOptions;
  }

  /**
   * Description : To patch the funding sources.
   * @description : To patch the funding sources.
   * @param event this is event passing from click event
   */
  onSelectedFundingChange(event: any) {
    this.step2.controls.fundingSource.setValue(event);
  }

  /**
   * Description : To initialize the funding sources for dropdown.
   * @description : To initialize the funding sources for dropdown.
   * @param funding this is an array
   * @param selectedItem this is optional parameter
   */
  setFundingintoDropDown(funding: any[], selectedItem?: string[]) {
    this.fundingSourceOption = [];
    for (const element of funding) {
      const checked = selectedItem && selectedItem.indexOf(element.id) > -1 ? true : false;
      const option: TreeviewItem = new TreeviewItem({ text: element.name, value: element.id, checked });
      this.fundingSourceOption.push(option);
    }
  }

  /**
   * Description : To initialize the funding sources for dropdown.
   * @description : To initialize the funding sources for dropdown.
   */
  async getFundingOptions() {
    this.fundingList = await this.defaultData.getFundingOptions();
    this.setFundingintoDropDown(this.fundingList);
    this.setFundingintoDropDown(this.fundingList, this.step2.controls.fundingSource.value);
    return this.fundingList;
  }

  /**
   * Description : Submit for step2.
   * @description : Submit for step2.
   */
  stepTwoSubmit() {
    this.submitted = true;
    if (this.step2.invalid) {
      return;
    }
  }

  onNextClick() {
    this.next.emit();
  }

  onBackClick() {
    this.back.emit();
  }
}
