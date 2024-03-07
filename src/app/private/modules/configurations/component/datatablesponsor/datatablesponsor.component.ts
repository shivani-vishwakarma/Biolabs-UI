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
  selector: 'app-datatablesponsor',
  templateUrl: './datatablesponsor.component.html',
  styleUrls: ['./datatablesponsor.component.css']
})
export class DatatablesponsorComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtMemberOptions: any = {};
  submitted = false;
  sponsorsData: any = [];
  sponsorsForm: any;
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
    this.getSponsors();
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
    this.sponsorsForm = this.formBuilder.group({
      globalsponsor: [''],
      value: ['', [Validators.maxLength(10)]],
      websiteLink: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
      sponsorshipStartDate: [null],
      sponsorshipEndDate: [null],
      localPOC: ['', [Validators.maxLength(50)]],
      title: ['', [Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
      email: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.EMAIL)]],
      notes: ['', [Validators.maxLength(200)]]
    });
  }

  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }

  updateSponsor(id: any, data: any) {
    this.submitted = true;
    if (this.sponsorsForm.invalid) {
      return;
    }
    this.sponsorsForm.value.sponsorshipStartDate = this.formatParseDate(this.sponsorsForm.value.sponsorshipStartDate);
    this.sponsorsForm.value.sponsorshipEndDate = this.formatParseDate(this.sponsorsForm.value.sponsorshipEndDate);
    const payload = {
      globalSponsorId: id,
      ...this.sponsorsForm.value,
    };
    delete payload.globalsponsor;
    this.configureService.updateSponsors(payload).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.getSponsors();
    });
    data.editable = false;
    this.isEditEnabled = false;
  }

  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }

  addhttp(url: string) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  editEnable(sponsor: any) {
    this.submitted = false;
    this.isEditEnabled = true;
    sponsor.editable = !sponsor.editable;
    this.setItemData(sponsor);
    const sponsorshipStartDate = (sponsor.sponsorshipStartDate) ? this.formatDatetoInput(sponsor.sponsorshipStartDate) : null ;
    const sponsorshipEndDate = (sponsor.sponsorshipEndDate) ? this.formatDatetoInput(sponsor.sponsorshipEndDate) : null ;
    setTimeout(() => {
      this.sponsorsForm.patchValue({
        globalsponsor: sponsor.globalsponsor,
        value: sponsor.value,
        websiteLink: sponsor.websiteLink,
        sponsorshipStartDate: sponsorshipStartDate ? this.dateAdapter.toModel({
          day: Number(sponsorshipStartDate[2]),
          month: Number(sponsorshipStartDate[1]),
          year: Number(sponsorshipStartDate[0])
        }) : null,
        sponsorshipEndDate: sponsorshipEndDate ? this.dateAdapter.toModel({
          day: Number(sponsorshipEndDate[2]),
          month: Number(sponsorshipEndDate[1]),
          year: Number(sponsorshipEndDate[0])
        }) : null,
        localPOC: sponsor.localPOC,
        title: sponsor.title,
        phoneNumber: sponsor.phoneNumber,
        email: sponsor.email,
        notes: sponsor.notes
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

  getSponsors() {
    this.configureService.getSponsorsData().subscribe(res => {
      this.sponsorsData = res.data;
      this.rerender();
    });
  }

  rerender(): void {
    if (!this.dtElement.dtInstance) {
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
