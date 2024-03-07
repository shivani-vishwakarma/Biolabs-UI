import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-offboarding',
  templateUrl: './member-offboarding.component.html',
  styleUrls: ['./member-offboarding.component.css']
})
export class MemberOffboardingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  addMemberRowVar = false;
  memberInfosubmitted = false;
  submitted = false;
  memberOffBoardingItems: any = [];
  addMemberOffboardingForm: any;
  isMemberOffboardingEditEnabled = false;
  selectedMemberItem: any;

  constructor(
    private formBuilder: FormBuilder,
    private configureService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.setDefaultValuesInFrom();
    this.getMemberOffBoardingData();
   }

  ngOnInit(): void {
    this.dtOptions = {
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
    this.addMemberOffboardingForm = this.formBuilder.group({
      stepName: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      templateLink: ['', [Validators.pattern(CONFIG.REGEX.WEBSITE)]],
    });
  }

  async addRow() {
    this.memberInfosubmitted = false;
    this.addMemberRowVar = !this.addMemberRowVar;
    this.setDefaultValuesInFrom();
  }

  addMemberOffboardingData(){
    this.submitted = true;
    if (this.addMemberOffboardingForm.invalid) {
      return;
    }
    const payload = {
      ...this.addMemberOffboardingForm.value,
      sequence: this.memberOffBoardingItems.length
    };
    this.addMemberRowVar = false;
    this.configureService.addMemberOffboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = true;
      this.getMemberOffBoardingData();
    });
  }

  dropMemberOffBoardRow(row: any, event: CdkDragDrop<string[]> | any){
    moveItemInArray(row, event.previousIndex, event.currentIndex);
    this.updateSequence(row);
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  updateSequence(row: any) {
    const ids = row.map((item: any) => {
      return item.id;
    });
    const payload = {
      id: ids,
      key: 'Member'
    };
    this.configureService.updateOffboardingSequence(payload).subscribe(res => {
      this.getMemberOffBoardingData();
    });
  }

  deleteMemberOffboardingItem() {
    this.configureService.deleteMemberOffboardingData(this.selectedMemberItem.id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      const updatedResItemIndex = this.memberOffBoardingItems.findIndex((item: any) => item.id === this.selectedMemberItem.id);
      const updatedData = this.memberOffBoardingItems.splice(updatedResItemIndex, 1);
      if (this.memberOffBoardingItems.length) {
        this.updateSequence(this.memberOffBoardingItems);
      }
      this.rerender();
    });
  }

  updateMemberOffboardingData(id: any, data: any) {
    this.submitted = true;
    if (this.addMemberOffboardingForm.invalid) {
      return;
    }
    const payload = {
      id,
      ...this.addMemberOffboardingForm.value,
      sequence: data.sequence
    };
    this.configureService.updateMemberOffboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getMemberOffBoardingData();
    });
    data.editable = false;
    this.isMemberOffboardingEditEnabled = false;
  }

  editEnable(memberoffboarding: any) {
    this.addMemberRowVar = false;
    this.memberInfosubmitted = false;
    this.isMemberOffboardingEditEnabled = true;
    memberoffboarding.editable = !memberoffboarding.editable;
    this.setMemberItemData(memberoffboarding);
    setTimeout(() => {
      this.addMemberOffboardingForm.patchValue({
        stepName: memberoffboarding.stepName,
        description: memberoffboarding.description,
        templateLink: memberoffboarding.templateLink,
      });
    }, 200);
  }

  setMemberItemData(item: any) {
    this.selectedMemberItem = item;
  }

  getMemberOffBoardingData() {
    this.configureService.getMemberOffboardingData().subscribe(res => {
      this.memberOffBoardingItems = res.data;
      this.rerender();
    });
  }

  rerender(): void {
    if (!this.dtElement.dtInstance) {
      this.dtTrigger.next();
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.addMemberRowVar = false;
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
