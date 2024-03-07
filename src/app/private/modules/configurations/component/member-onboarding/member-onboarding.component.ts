import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-onboarding',
  templateUrl: './member-onboarding.component.html',
  styleUrls: ['./member-onboarding.component.css']
})
export class MemberOnboardingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtMemberElement!: DataTableDirective;
  dtMemberTrigger: Subject<any> = new Subject();
  dtMemberOptions: any = {};
  addRowVar = false;
  submitted = false;
  memberOnBoardingItems: any = [];
  addMemberOnboardingForm: any;
  isOnboardingEditEnabled = false;
  selectedItem: any;

  constructor(
    private formBuilder: FormBuilder,
    private configureService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.setDefaultValuesInFrom();
    this.getMemberOnBoardingData();
   }

  ngOnInit(): void {
    this.dtMemberOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'frtip',
      ordering: false,
      buttons: [
        {
          extend: 'csv',
          footer: false,
        }
      ]
    };
  }
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
  private setDefaultValuesInFrom() {
    this.addMemberOnboardingForm = this.formBuilder.group({
      stepName: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      templateLink: ['', [Validators.pattern(CONFIG.REGEX.WEBSITE)]],
    });
  }

  async addRow() {
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.setDefaultValuesInFrom();
  }

  addMemberOnboardingData(){
    this.submitted = true;
    if (this.addMemberOnboardingForm.invalid) {
      return;
    }
    const payload = {
      ...this.addMemberOnboardingForm.value,
      sequence: this.memberOnBoardingItems.length
    };
    this.addRowVar = false;
    this.configureService.addMemberOnboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getMemberOnBoardingData();
    });
  }

  dropRow(row: any, event: CdkDragDrop<string[]> | any){
    moveItemInArray(row, event.previousIndex, event.currentIndex);
    this.updateSequence(row);
  }

  updateSequence(row: any) {
    const ids = row.map((item: any) => {
      return item.id;
    });
    const payload = {
      id: ids,
      key: 'Member'
    };
    this.configureService.updateSequence(payload).subscribe(res => {
      this.getMemberOnBoardingData();
    });
  }

  updateMemberOnboardingData(id: any, data: any) {
    this.submitted = true;
    if (this.addMemberOnboardingForm.invalid) {
      return;
    }
    const payload = {
      id,
      ...this.addMemberOnboardingForm.value,
      sequence: data.sequence
    };
    this.configureService.updateMemberOnboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getMemberOnBoardingData();
    });
    data.editable = false;
    this.isOnboardingEditEnabled = false;
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  editEnable(onboarding: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isOnboardingEditEnabled = true;
    onboarding.editable = !onboarding.editable;
    this.setItemData(onboarding);
    setTimeout(() => {
      this.addMemberOnboardingForm.patchValue({
        stepName: onboarding.stepName,
        description: onboarding.description,
        templateLink: onboarding.templateLink,
      });
    }, 200);
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  getMemberOnBoardingData() {
    this.configureService.getMemberOnboardingData().subscribe(res => {
      this.memberOnBoardingItems = res.data;
      this.rerender();
    });
  }

  deleteMemberOnboardingItem() {
    this.configureService.deleteMemberOnboardingData(this.selectedItem.id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      const updatedResItemIndex = this.memberOnBoardingItems.findIndex((item: any) => item.id === this.selectedItem.id);
      const updatedData = this.memberOnBoardingItems.splice(updatedResItemIndex, 1);
      if (this.memberOnBoardingItems.length) {
        this.updateSequence(this.memberOnBoardingItems);
      }
      this.rerender();
    });
  }

  rerender(): void {
    if (!this.dtMemberElement.dtInstance) {
      this.dtMemberTrigger.next();
      return;
    }
    this.dtMemberElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.addRowVar = false;
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtMemberTrigger.next();
    });
  }
}
