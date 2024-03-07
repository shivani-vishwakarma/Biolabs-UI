import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { CHECKLIST_STATUS, CONFIG } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { MemberOnboardOffboardService } from '../../services/member-onboard-offboard.service';

@Component({
  selector: 'app-member-onboarding',
  templateUrl: './member-onboarding.component.html',
  styleUrls: ['./member-onboarding.component.css']
})
export class MemberOnboardingComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  @ViewChild(DataTableDirective, { static: false })
  closeResult: string | undefined;
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  selectedData: any = {};
  selectedItem: any;
  memberId: any;
  memberOnboardData: any = [];
  fullyCompletedDate: any;
  fullyCompletedStatus: any;
  previousStatus: any;
  globalDateFormat = environment.globalDateFormat;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private memberOnboardOffboard: MemberOnboardOffboardService,
    private defaultDataService: DefaultDataService,
    private datePipe: DatePipe,
    private dateAdapter: NgbDateAdapter<any>,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      stepName: [''],
      completedDate: [null],
      status: [0],
      description: [''],
      templateLink: [''],
      completedFileLink: ['', [Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      notes: ['', [Validators.maxLength(200)]],
    });
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      ordering: false,
      multiple: true,
      retrieve: true,
      buttons: [
      ]
    };
  }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe(params => {
      if (params && params.id) {
        this.memberId = params.id;
        this.getMemberOnboardingChecklist();
      }
    });
  }
  getMemberOnboardingChecklist() {
    this.memberOnboardOffboard.getMemberOnboardingChecklist(this.memberId, 'member-checklist').subscribe(res => {
      this.memberOnboardData = res.data;
      if (!this.memberOnboardData.length) {
        this.rerender();
        return;
      }
      this.getFullyCompleteDate(this.memberOnboardData, true);
    });
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  open(content: any, selectedItem: any, modalSize?: string) {
    this.selectedItem = selectedItem;
    this.previousStatus = selectedItem.checklist_status;
    const parserCompletedDate = (selectedItem.completedDate) ? this.formatDatetoInput(selectedItem.completedDate) : null;
    const completedDate = parserCompletedDate ? this.dateAdapter.toModel({
      day: Number(parserCompletedDate[2]),
      month: Number(parserCompletedDate[1]),
      year: Number(parserCompletedDate[0])
    }) : null;
    this.form.patchValue({ ...selectedItem, status: selectedItem.checklist_status, completedDate });
    const size = modalSize ? modalSize : 'xl';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size, backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  get f() { return this.form.controls; }
  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      completedDate: this.form.value.completedDate ? this.formatParseDate(this.form.value.completedDate) : null,
      completedFileLink: this.form.value.completedFileLink,
      notes: this.form.value.notes,
      key: 'member-checklist',
      memberOnboardingId: this.selectedItem.id,
      userId: this.memberId,
      checklist_status: parseInt(this.form.value.status, 10),
    };
    if ((this.selectedItem.checklist_status != payload.checklist_status)
      || (this.selectedItem.completedDate != payload.completedDate)) {
      this.getChecklistStatusAndDate(payload);
      if (this.fullyCompletedStatus) {
        const fullyCompletedDateWithoutTime = this.defaultDataService.dateWithoutTime(this.fullyCompletedDate);
        const fullyCompletedDate = this.fullyCompletedDate ? this.datePipe.transform(fullyCompletedDateWithoutTime, 'yyyy-MM-dd') : null;
        payload = { ...payload, ...{ memberOnboardCompletedDate: fullyCompletedDate, memberOnboardCompletedStatus: 1 } };
      } else {
        payload = { ...payload, ...{ memberOnboardCompletedDate: null, memberOnboardCompletedStatus: 0 } };
      }
    }
    this.memberOnboardOffboard.updateMemberOnboardingChecklist(payload).subscribe(res => {
      if (!res) {
        return;
      }
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.modalService.dismissAll();
      this.getMemberOnboardingChecklist();
    });
  }

  getChecklistStatusAndDate(payload: any): any {
    const checklistData = this.memberOnboardData;
    const objIndex = checklistData.findIndex(((obj: any) => obj.id == this.selectedItem.id));
    checklistData[objIndex] = payload;
    this.getFullyCompleteDate(checklistData);
  }

  getFullyCompleteDate(checklistData: any, rerender?: any) {
    this.fullyCompletedDate = null;
    for (const element of checklistData) {
      if (element.checklist_status == 0 || element.checklist_status == 1) {
        this.fullyCompletedDate = null;
        this.fullyCompletedStatus = 0;
        if (rerender) {
          this.rerender();
        }
        return;
      } else {
        if (rerender) {
          if (element.completedDate && !this.fullyCompletedDate) {
            this.fullyCompletedDate = new Date(element.completedDate);
            this.rerender();
          }
        }
        if (new Date(element.completedDate) > this.fullyCompletedDate) {
          this.fullyCompletedDate = new Date(element.completedDate);
          if (rerender) {
            this.rerender();
          }
        }
        this.fullyCompletedStatus = 1;
      }
    }
  }

  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }
  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }

  formatDatetoInput(date: any) {
    const formattedDateWithoutTime = (date) ?
      this.defaultDataService.dateWithoutTime(new Date(date)) : null;
    const formattedDate = formattedDateWithoutTime ? this.datePipe.transform(formattedDateWithoutTime, 'yyyy-MM-dd') : null;
    const parserCommitteeDate = formattedDate ? formattedDate.split('-') : null;
    return parserCommitteeDate;
  }

  /**
   * @description This method is used to get the text from status id.
   * Description: This method is used to get the text from status id.
   * @param status Status Id.
   * @returns will return application status in text.
   */
  getstatusText(status: number) {
    return CHECKLIST_STATUS[status];
  }

  rerender(): void {
    if (!this.dtElement) {
      this.dtTrigger.next();
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
