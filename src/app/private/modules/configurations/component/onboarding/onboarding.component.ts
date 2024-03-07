import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  addRowVar = false;
  submitted = false;
  onBoardingItems: any = [];
  addOnboardingForm: any;
  isOnboardingEditEnabled = false;
  selectedItem: any;

  constructor(
    private formBuilder: FormBuilder,
    private configureService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.setDefaultValuesInFrom();
    this.getOnBoardingData();
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

  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
  private setDefaultValuesInFrom() {
    this.addOnboardingForm = this.formBuilder.group({
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

  addOnboardingData(){
    this.submitted = true;
    if (this.addOnboardingForm.invalid) {
      return;
    }
    const payload = {
      ...this.addOnboardingForm.value,
      sequence: this.onBoardingItems.length
    };
    this.addRowVar = false;
    this.configureService.addOnboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getOnBoardingData();
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
      key: 'Company'
    };
    this.configureService.updateSequence(payload).subscribe(res => {
      this.getOnBoardingData();
    });
  }

  deleteOnboardingItem() {
    this.configureService.deleteOnboardingData(this.selectedItem.id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      const updatedResItemIndex = this.onBoardingItems.findIndex((item: any) => item.id === this.selectedItem.id);
      const updatedData = this.onBoardingItems.splice(updatedResItemIndex, 1);
      if (this.onBoardingItems.length) {
        this.updateSequence(this.onBoardingItems);
      }
      this.rerender();
    });
  }

  updateOnboardingData(id: any, data: any) {
    this.submitted = true;
    if (this.addOnboardingForm.invalid) {
      return;
    }
    const payload = {
      id,
      ...this.addOnboardingForm.value,
      sequence: data.sequence
    };
    this.configureService.updateOnboardingData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getOnBoardingData();
    });
    data.editable = false;
    this.isOnboardingEditEnabled = false;
  }

  editEnable(onboarding: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isOnboardingEditEnabled = true;
    onboarding.editable = !onboarding.editable;
    this.setItemData(onboarding);
    setTimeout(() => {
      this.addOnboardingForm.patchValue({
        stepName: onboarding.stepName,
        description: onboarding.description,
        templateLink: onboarding.templateLink,
      });
    }, 200);
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  // dropRow(row: any, event: CdkDragDrop<string[]> | any) {
  // }

  getOnBoardingData() {
    this.configureService.getOnboardingData().subscribe(res => {
      this.onBoardingItems = res.data;
      this.rerender();
    });
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
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
