import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offboarding',
  templateUrl: './offboarding.component.html',
  styleUrls: ['./offboarding.component.css']
})
export class OffboardingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  addRowVar = false;
  submitted = false;
  offBoardingItems: any = [];
  addOffboardingForm: any;
  isOffboardingEditEnabled = false;
  selectedItem: any;

  constructor(
    private formBuilder: FormBuilder,
    private configureService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.setDefaultValuesInFrom();
    this.getOffBoardingData();
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
    this.addOffboardingForm = this.formBuilder.group({
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

  addOffboardingData() {
    this.submitted = true;
    if (this.addOffboardingForm.invalid) {
      return;
    }
    const payload = {
      ...this.addOffboardingForm.value,
      sequence: this.offBoardingItems.length
    };
    this.addRowVar = false;
    this.configureService.addOffboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getOffBoardingData();
    });
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  dropRow(row: any, event: CdkDragDrop<string[]> | any) {
    moveItemInArray(row, event.previousIndex, event.currentIndex);
    this.updateSequence(row);
  }

  updateSequence(row: any){
    const ids = row.map((item: any) => {
      return item.id;
    });
    const payload = {
      id: ids,
      key: 'Company'
    };
    this.configureService.updateOffboardingSequence(payload).subscribe(res => {
      this.getOffBoardingData();
    });
  }

  deleteOffboardingItem() {
    this.configureService.deleteOffboardingData(this.selectedItem.id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      const updatedResItemIndex = this.offBoardingItems.findIndex((item: any) => item.id === this.selectedItem.id);
      const updatedData = this.offBoardingItems.splice(updatedResItemIndex, 1);
      if (this.offBoardingItems.length) {
        this.updateSequence(this.offBoardingItems);
      }
      this.rerender();
    });
  }

  updateOffboardingData(id: any, data: any) {
    this.submitted = true;
    if (this.addOffboardingForm.invalid) {
      return;
    }
    const payload = {
      id,
      ...this.addOffboardingForm.value,
      sequence: data.sequence
    };
    this.configureService.updateOffboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getOffBoardingData();
    });
    data.editable = false;
    this.isOffboardingEditEnabled = false;
  }

  editEnable(offboarding: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isOffboardingEditEnabled = true;
    offboarding.editable = !offboarding.editable;
    this.setItemData(offboarding);
    setTimeout(() => {
      this.addOffboardingForm.patchValue({
        stepName: offboarding.stepName,
        description: offboarding.description,
        templateLink: offboarding.templateLink,
      });
    }, 200);
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  getOffBoardingData() {
    this.configureService.getOffboardingData().subscribe(res => {
      this.offBoardingItems = res.data;
      this.rerender();
    });
  }

  rerender(): void {
    if (!this.dtElement.dtInstance) {
      this.dtTrigger.next();
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.addRowVar = false;
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
