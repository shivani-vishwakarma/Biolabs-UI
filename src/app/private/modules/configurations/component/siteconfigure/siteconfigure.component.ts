import { DatePipe, getCurrencySymbol } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { autoCorrectedDatePipe, DefaultDataService, inputDollarMasking, inputNumberMasking } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-siteconfigure',
  templateUrl: './siteconfigure.component.html',
  styleUrls: ['./siteconfigure.component.css']
})
export class SiteconfigureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective> | any;
  dtTrigger: Subject<any> = new Subject();
  submitted = false;
  submittedConference = false;
  dtOptions: any = {};
  equipments: any[] = [];
  siteConfigId: any;
  addEquipmentForm!: FormGroup;
  addRowVar = false;
  numberMask = inputDollarMasking;
  inputNumberMask = inputNumberMasking(6);
  autoCorrectedDatePipe = autoCorrectedDatePipe;
  // dateMask: any = [/\d/, /\d/, " ", /[A-Z]/,/[a-z]/, /[a-z]/, " ", /\d/, /\d/, /\d/, /\d/]
  openD: any;
  openDate: any = null;
  selectedItem: any;
  selectedSiteDetail: any;
  siteConfigForm: any;
  siteConfigRes: any;
  siteConfigValidation: any = {
    totalSquarefeet: false,
    totalOfficeSquarefeet: false,
    totalLabSquarefeet: false,
    totalWorkstationSquarefeet: false,
    totalLabBenchSquarefeet: false
  };
  isEquipmentEditEnabled = false;
  isValid = true;
  isvalid = true;
  constructor(
    public datepipe: DatePipe,
    public defaultDataService: DefaultDataService,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private toastr: ToastrService) {

    this.setEquipmentDetailsDefaultValuesInFrom();
    this.siteConfigForm = {
      openDate: '',
      closingDate: '',
      totalSquarefeet: null,
      totalOfficeSquarefeet: null,
      totalLabSquarefeet: null,
      totalValueEquipment: null,
      totalWorkstationSquarefeet: null,
      totalLabBenchSquarefeet: null,
    };
  }

  ngOnInit(): void {
    this.getEquipmentsDetails();
    const selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.getSiteConfigDetails(selectedSiteDetail.id);
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

  private setEquipmentDetailsDefaultValuesInFrom() {
    this.addEquipmentForm = this.formBuilder.group({
      manufacturer: ['', [Validators.required, Validators.maxLength(30)]],
      model: ['', [Validators.required, Validators.maxLength(30)]],
      quantity: [null, [Validators.pattern('[0-9]{0,3}')]],
      value: [null],
      notes: ['', Validators.maxLength(200)]
    });
  }
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }
  // mask(rawValue: any) {
  //   // add logic to generate your mask array
  //   return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  // }

  // convenience getter for easy access to form fields
  get f() { return this.addEquipmentForm.controls; }

  getCurrency(currency: any) {
    return getCurrencySymbol(currency, 'wide');
  }
   getEquipmentsDetails() {
     this.configService.getEquipments()
      .subscribe(
        (response) => {
          this.equipments = response.data;
          this.rerender();
        }, (error) => {
          console.error(error);
        });
  }
  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    // return parserDate[2].length > 4 ? false : parserDate[2]
    if (parserDate && parserDate[2].length > 4 || parserDate && parserDate[2].length < 4){
      return false;
    }
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }
  onChange(key: any){
    if (!this.siteConfigForm[key]) {
      this.onInputChange(key);
    }
  }
  formatCurrencyToNumber(value: any){
    const formattedVal = (value && typeof (value) === 'string')
    ? +(value.replace(/,/g, '')) : value;
    return formattedVal;
  }
  async onInputChange(key: any, event?: any) {
    let data: any = {};
    if (key === 'openDate' || key === 'closingDate') {
      const formattedDate = this.formatParseDate(this.siteConfigForm[key]);
      // if(formattedDate){
      data = { [key]: formattedDate };
      //   this.isValid = true;
      // } else{
      //   this.isValid = false;
      // }
    } else {
      this.siteConfigForm[key] = this.siteConfigForm[key] ?
        this.formatCurrencyToNumber(this.siteConfigForm[key]) : null;
      data = { [key]: this.siteConfigForm[key] ? Number(this.siteConfigForm[key]) : null };
    }
    // if (data[key]){
    //   this.siteConfigValidation[key] = (data[key].toString()).length <= 6 ? false : true;
    // }else{
    //   this.siteConfigValidation[key] = false;
    // }
    if (this.siteConfigForm) {
      // data['id'] = Number(this.costConfigId);
      data = { ...data, id: Number(this.siteConfigId) };
    }

    const siteConfigRes = await this.configService.addSiteConfig(data);
    if (siteConfigRes && siteConfigRes.data) {
      this.siteConfigId = siteConfigRes.data.id;

    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.addEquipmentForm.invalid && !this.addEquipmentForm.controls.value.errors?.maxlength) {
      return;
    }
    this.addRowVar = false;
    this.addEquipmentForm.value.value = this.addEquipmentForm.value.value ?
    this.formatCurrencyToNumber(this.addEquipmentForm.value.value) : null;
    const obj = { ...this.addEquipmentForm.value };
    const equipmentsRes = await this.configService.addEquipments(obj);
    if (equipmentsRes) {
      this.toastr.success(equipmentsRes.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getEquipmentsDetails();
      this.submitted = false;
    }
  }

  getSiteConfigDetails(siteId: any) {
    this.configService.getSiteConfigDetails(siteId).subscribe(res => {
      if (res && res.data) {
        this.siteConfigId = res.data.id;
        const openDateWithoutTime = this.defaultDataService.dateWithoutTime(res.data.openDate);
        const parserOpenDate: any = (openDateWithoutTime) ?
        this.datepipe.transform(new Date(openDateWithoutTime), 'dd-MM-yyyy') : null;
        const closingDateWithoutTime = this.defaultDataService.dateWithoutTime(res.data.closingDate);
        const parserClosingDate: any = (closingDateWithoutTime) ?
        this.datepipe.transform(new Date(closingDateWithoutTime), 'dd-MM-yyyy') : null;
        this.siteConfigForm = {
          openDate: parserOpenDate,
          closingDate: parserClosingDate,
          totalSquarefeet: res.data.totalSquarefeet,
          totalOfficeSquarefeet: res.data.totalOfficeSquarefeet,
          totalLabSquarefeet: res.data.totalLabSquarefeet,
          totalValueEquipment: res.data.totalValueEquipment,
          totalWorkstationSquarefeet: res.data.totalWorkstationSquarefeet,
          totalLabBenchSquarefeet: res.data.totalLabBenchSquarefeet,
        };
      }
    });
  }
  async updateEquipmentDetails(id: any, equipment: any) {
    this.submitted = true;
    if (this.addEquipmentForm.invalid ) {
      return;
    }
    this.addEquipmentForm.value.value = this.addEquipmentForm.value.value ?
    this.formatCurrencyToNumber(this.addEquipmentForm.value.value) : null;
    const obj = { id, ...this.addEquipmentForm.value };
    const updateEquipments = await this.configService.addEquipments(obj);
    if (updateEquipments) {
      this.toastr.success(updateEquipments.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      equipment.editable = false;
      this.submitted = false;
      this.isEquipmentEditEnabled = false;
      this.getEquipmentsDetails();
    }
  }
  async deleteEquipmentDetails() {
    await this.configService.deleteEquipments(this.selectedItem.equipment_id).subscribe(res => {
      this.toastr.success(res.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getEquipmentsDetails();
    });
  }
  editEnable(equipment: any) {
    this.addRowVar = false;
    this.submitted = false;
    this.isEquipmentEditEnabled = true;
    equipment.editable = !equipment.editable;
    this.setItemData(equipment);
    setTimeout(() => {
      this.addEquipmentForm.patchValue({
        manufacturer: equipment.equipment_manufacturer,
        model: equipment.equipment_model,
        quantity: equipment.equipment_quantity,
        value: equipment.equipment_value,
        notes: equipment.equipment_notes,
      });
    }, 200);
  }

  async addRow() {
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.setEquipmentDetailsDefaultValuesInFrom();
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
