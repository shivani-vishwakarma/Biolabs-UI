import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from 'src/app/shared/utility/config.service';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService, inputNumberMasking } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-eventtrainig',
  templateUrl: './eventtrainig.component.html',
  styleUrls: ['./eventtrainig.component.css']
})
export class EventtrainigComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective> | any;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  addRowVar = false;
  submitted = false;
  eventsandTrainings: any[] = [];
  addEventsandTrainingForm!: FormGroup;
  selectedItem: any;
  inputNumberMask = inputNumberMasking(5);
  isEventsandTrainingEditEnabled = false;
  selectedSiteDetail: any;
  globalDateFormat = environment.globalDateFormat;
  constructor(
    public datepipe: DatePipe,
    public defaultDataService: DefaultDataService,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private toastr: ToastrService,
    private dateAdapter: NgbDateAdapter<any>) {
    this.setEventsandTrainingDetailsDefaultValuesInFrom();
  }

  ngOnInit(): void {
    this.getEventsandTrainingsDetails();
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
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
  }
  private setEventsandTrainingDetailsDefaultValuesInFrom() {
    this.addEventsandTrainingForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      date: [null],
      eventLink: ['', [Validators.maxLength(100)]],
      sponsor: ['', [Validators.maxLength(50)]],
      registrationCount: [null],
      numberAttended: [null],
      cost: [''],
      notes: ['', Validators.maxLength(200)],

    });
  }
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  getEventsandTrainingsDetails() {
    this.configService.getEventsandTrainings()
      .subscribe(
        (response) => {
          this.eventsandTrainings = response.data;
          this.rerender();
        }, (error) => {
          console.error(error);
        });
  }
  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    if (parserDate && parserDate[2].length > 4 || parserDate && parserDate[2].length < 4){
      return false;
    }
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }
  formatCurrencyToNumber(value: any) {
    const formattedVal = (value && typeof (value) === 'string')
      ? +(value.replace(/,/g, '')) : value;
    return formattedVal;
  }
  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }
  async onSubmit() {
    this.submitted = true;
    const parsedDate = this.formatParseDate(this.addEventsandTrainingForm.value.date);
    const dateD = (this.addEventsandTrainingForm.value.date == '') ? null : parsedDate;
    if (this.addEventsandTrainingForm.invalid) {
      return;
    }
    this.addRowVar = false;
    this.addEventsandTrainingForm.value.cost = this.addEventsandTrainingForm.value.cost ?
      this.formatCurrencyToNumber(this.addEventsandTrainingForm.value.cost) : null;
    this.addEventsandTrainingForm.value.date = dateD;
    const obj = { ...this.addEventsandTrainingForm.value };
    const eventsandTrainingRes = await this.configService.addEventsandTrainings(obj);
    if (eventsandTrainingRes) {
      this.toastr.success(eventsandTrainingRes.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getEventsandTrainingsDetails();
      this.submitted = false;
    }
  }
  async updateEventsandTrainingDetails(id: any, eventsandTrainings: any) {
    this.submitted = true;
    const parsedDate = this.formatParseDate(this.addEventsandTrainingForm.value.date);
    const dateD = (this.addEventsandTrainingForm.value.date == '') ? null : parsedDate;

    if (this.addEventsandTrainingForm.invalid) {
      return;
    }

    this.addEventsandTrainingForm.value.cost = this.addEventsandTrainingForm.value.cost ?
      this.formatCurrencyToNumber(this.addEventsandTrainingForm.value.cost) : null;
    this.addEventsandTrainingForm.value.date = dateD;
    const obj = { id, ...this.addEventsandTrainingForm.value };
    const updateEventsandTraining = await this.configService.addEventsandTrainings(obj);
    if (updateEventsandTraining) {
      this.toastr.success(updateEventsandTraining.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.isEventsandTrainingEditEnabled = false;
      eventsandTrainings.editable = false;
      this.getEventsandTrainingsDetails();
    }
  }
  async deleteEventsandTrainingDetails() {
    await this.configService.deleteEventsandTraining(this.selectedItem.events_and_training_id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getEventsandTrainingsDetails();
    });
  }

  editEnable(eventsandTrainings: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isEventsandTrainingEditEnabled = true;
    eventsandTrainings.editable = !eventsandTrainings.editable;
    this.setItemData(eventsandTrainings);
    const parserDate: any = (eventsandTrainings.events_and_training_date) ?
      this.datepipe.transform(new Date(this.formatDate(eventsandTrainings.events_and_training_date)), 'yyyy-MM-dd') : null;
    const parsedDate = parserDate ? parserDate.split('-') : null;
    const dateDTUPT = (eventsandTrainings.events_and_training_date) ? this.dateAdapter.toModel({
      day: parsedDate[2],
      month: parsedDate[1],
      year: parsedDate[0]
    }) : null;
    setTimeout(() => {
      this.addEventsandTrainingForm.patchValue({
        name: eventsandTrainings.events_and_training_name,
        date: dateDTUPT,
        eventLink: eventsandTrainings.events_and_training_eventLink,
        sponsor: eventsandTrainings.events_and_training_sponsor,
        registrationCount: eventsandTrainings.events_and_training_registrationCount,
        numberAttended: eventsandTrainings.events_and_training_numberAttended,
        cost: eventsandTrainings.events_and_training_cost,
        notes: eventsandTrainings.events_and_training_notes,
      });
    }, 200);
  }

  async addRow() {
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.setEventsandTrainingDetailsDefaultValuesInFrom();
  }
  setItemData(item: any) {
    this.selectedItem = item;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Do your stuff
        dtInstance.destroy(); // Will be ok on last dataTable, will fail on previous instances
        dtElement.dtTrigger.next();
      });
    });
  }

}
