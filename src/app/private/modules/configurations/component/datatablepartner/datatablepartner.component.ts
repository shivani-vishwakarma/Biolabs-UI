import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL, CONFIG } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-datatablepartner',
  templateUrl: './datatablepartner.component.html',
  styleUrls: ['./datatablepartner.component.css']
})
export class DatatablepartnerComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtMemberOptions: any = {};
  addRowVar = false;
  submitted = false;
  partnersData: any = [];
  partnersForm: any;
  isEditEnabled = false;
  selectedItem: any;
  globalDateFormat = environment.globalDateFormat;

  constructor(
    private formBuilder: FormBuilder,
    private configureService: ConfigurationService,
    private toastr: ToastrService,
    private defaultDataService: DefaultDataService,
    private datepipe: DatePipe,
    private dateAdapter: NgbDateAdapter<any>
  ) {
    this.setDefaultValuesInFrom();
    this.getPartnersData();
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
    this.partnersForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      industryType: ['', [Validators.maxLength(50)]],
      websiteLink: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      aggrementStartDate: [null],
      aggrementEndDate: [null],
      linkToAggrement: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
    });
  }

  async addRow() {
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.setDefaultValuesInFrom();
  }

  addPartner(){
    this.submitted = true;
    if (this.partnersForm.invalid) {
      return;
    }
    this.partnersForm.value.aggrementStartDate = this.formatParseDate(this.partnersForm.value.aggrementStartDate);
    this.partnersForm.value.aggrementEndDate = this.formatParseDate(this.partnersForm.value.aggrementEndDate);
    const payload = {
      ...this.partnersForm.value
    };
    this.addRowVar = false;
    this.configureService.addPartnersData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getPartnersData();
    });
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

  updatePartner(id: any, data: any) {
    this.submitted = true;
    if (this.partnersForm.invalid) {
      return;
    }
    this.partnersForm.value.aggrementStartDate = this.formatParseDate(this.partnersForm.value.aggrementStartDate);
    this.partnersForm.value.aggrementEndDate = this.formatParseDate(this.partnersForm.value.aggrementEndDate);
    const payload = {
      id,
      ...this.partnersForm.value,
    };
    this.configureService.addPartnersData(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getPartnersData();
    });
    data.editable = false;
    this.isEditEnabled = false;
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  editEnable(partner: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isEditEnabled = true;
    partner.editable = !partner.editable;
    this.setItemData(partner);
    const aggrementStartDate = (partner.aggrementStartDate) ? this.formatDatetoInput(partner.aggrementStartDate) : null ;
    const aggrementEndDate = (partner.aggrementEndDate) ? this.formatDatetoInput(partner.aggrementEndDate) : null ;
    setTimeout(() => {
      this.partnersForm.patchValue({
        name: partner.name,
        industryType: partner.industryType,
        websiteLink: partner.websiteLink,
        aggrementStartDate: aggrementStartDate ? this.dateAdapter.toModel({
          day: Number(aggrementStartDate[2]),
          month: Number(aggrementStartDate[1]),
          year: Number(aggrementStartDate[0])
        }) : null,
        aggrementEndDate: aggrementEndDate ? this.dateAdapter.toModel({
          day: Number(aggrementEndDate[2]),
          month: Number(aggrementEndDate[1]),
          year: Number(aggrementEndDate[0])
        }) : null,
        linkToAggrement: partner.linkToAggrement,
      });
    }, 200);
  }

  formatDatetoInput(date: any) {
    const formattedDateWithoutTime = (date) ?
      this.defaultDataService.dateWithoutTime(new Date(date)) : null;
    const formattedDate = formattedDateWithoutTime ? this.datepipe.transform(formattedDateWithoutTime, 'yyyy-MM-dd') : null;
    const parsedDate = formattedDate ? formattedDate.split('-') : null;
    return parsedDate;
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  getPartnersData() {
    this.configureService.getPartnersData().subscribe(res => {
      this.partnersData = res.data;
      this.rerender();
    });
  }

  deletePartner() {
    this.configureService.deletePartner(this.selectedItem.id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getPartnersData();
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
