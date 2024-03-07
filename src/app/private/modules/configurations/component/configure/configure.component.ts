
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { inputDollarMasking } from 'src/app/shared/service/default-data.service';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective> | any;

  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();

  dtOptions: any = {};
  dtOptions2: any = {};

  submitted = false;
  submittedConference = false;
  orderID = 0;
  costConfigId: any;
  month!: string;
  enableEditFlag = [];
  conferenceRooms: any[] = [];
  data: any[] = [];
  fDay: any;
  lDay: any;
  invoiceText = 'Biolabs';
  companyId = 0;
  addRowVar = false;
  addConferenceRowVar = false;
  invoiceData: any;
  addProductForm!: FormGroup;
  costConfigForm: any;
  selectedItem: any;
  companyObj: any;
  products: any = [];
  maxDate = '';
  minDate = '';
  oldMonthDte = false;
  selectedSiteDetail: any;
  minDateAddUpdate = '';
  maxDateAddUpdate = '';
  productType: any;
  selectedConference: any;
  addConferenceRoomForm!: FormGroup;
  isConferenceSelected = false;
  isConferenceEditEnabled = false;
  isProductEditEnabled = false;
  numberMask = inputDollarMasking;
  siteName = 'Eisai';
  qtyValidation = false;
  constructor(
    public datepipe: DatePipe,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private toastr: ToastrService) {

    this.setDefaultValuesInFrom();
    this.setConferenceDefaultValuesInFrom();
    this.costConfigForm = {
      phoneRooms: '',
      labBench: '',
      office: '',
      workstation: '',
      membership: '',
      privateLab: '',
    };
  }

  private setDefaultValuesInFrom() {
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      sqFootage: [null, [Validators.pattern('[0-9]{0,4}')]],
      totalQuantity: [null, [Validators.pattern('[0-9]{0,3}')]],
      cost: ['', Validators.required],
      recurrence: [true],
      productTypeId: ['']
    });
    // this.addProductForm.controls.totalQuantity.valueChanges.subscribe(res=>{
    //   this.qtyValidation = (res.toString()).length <=3 ? false : true
    // })
  }

  private setConferenceDefaultValuesInFrom() {
    this.addConferenceRoomForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      capacity: [null, [Validators.pattern('[0-9]{0,3}')]],
      space: [null, [Validators.pattern('[0-9]{0,4}')]],
      notes: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getProductType();
    this.getConferenceRoomDetails(true);
    this.getCostConfigDetails();
    const siteDetails = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.siteName = siteDetails.name;
    this.dtOptions[0] = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      ordering: false,
      multiple: true,
      retrieve: true,
      buttons: [
      ],
    };
    this.lode();
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
  }

  lode() {
    this.dtOptions[1] = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      ordering: false,
      retrieve: true,
      buttons: [
        // 'print',
        {
          extend: 'print',
          footer: true,
          title: this.siteName + ' Invoice Configuration ',
        },
        {
          extend: 'csv',
          footer: true,
          title: this.siteName + ' Invoice Configuration ',
        }
      ],
      multiple: true
    };
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  async onInputChange(key: any) {
    this.costConfigForm[key] = this.costConfigForm[key] ? this.formatCurrencyToNumber(this.costConfigForm[key]) : null;
    let data: any = { [key]: this.costConfigForm[key] ? Number(this.costConfigForm[key]) : null };
    if (this.costConfigId) {
      data = { ...data, id: Number(this.costConfigId) };
    }
    const costConfigRes = await this.configService.addCostConfig(data);
    if (costConfigRes && costConfigRes.data) {
      this.costConfigId = costConfigRes.data.id;
    }
  }
  getCurrency(currency: any) {
    return getCurrencySymbol(currency, 'wide');
  }
  setItemData(item: any) {
    this.selectedItem = item;
  }
  setConferenceItemData(item: any) {
    this.isConferenceSelected = true;
    this.selectedConference = item;
  }

  deleteProduct() {
    if (this.isConferenceSelected) {
      this.configService.deleteConferenceRoom(this.selectedConference.conference_rooms_id).subscribe(res => {
        this.isConferenceSelected = false;
        this.toastr.success(res.message, '', {
          timeOut: 3000,
          closeButton: true
        });
        this.getConferenceRoomDetails();
      });
    }else{
      this.configService.deleteProduct(this.selectedItem.product_id)
      .subscribe(() => {
        this.getProducts();
      }, () => {
      });
    }

  }

  closeModal(){
    this.isConferenceSelected = false;
  }

  getProductTypeNameById(productTypeId: number) {
    if (productTypeId && productTypeId > 0 && this.productType) {
      const pData = this.productType.filter((productType: any) => productType.id == productTypeId);
      return pData[0].productTypeName;
    }
    return '-';
  }
  getCostConfigDetails() {
    this.configService.getCostConfigDetails().subscribe(res => {
      if (res.data) {
        this.costConfigId = res.data.id;
        this.costConfigForm = {
          phoneRooms: res.data.phoneRooms,
          labBench: res.data.labBench,
          office: res.data.office,
          workstation: res.data.workstation,
          membership: res.data.membership,
          privateLab: res.data.privateLab,
        };
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addProductForm.controls; }

  /**
   * @description add product in invoice.
   * @returns void
   */
  async onSubmit() {
    this.submitted = true;
    if (this.addProductForm.invalid) {
      return;
    }
    this.addProductForm.value.sqFootage = this.addProductForm.value.sqFootage ?
      this.formatCurrencyToNumber(this.addProductForm.value.sqFootage) : null;
    const productData = this.configService.addProduct(this.addProductForm.value);
    productData.then(() => {
      this.toastr.success(CONFIG.SUCCESS_MSG.PRODUCT_ADDED, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.addRowVar = false;
      this.isProductEditEnabled = false;
      this.getProducts();
    }, () => {
    });
  }

  async updateConferenceRoom(id: any, conferenceRoom: any){
    this.submittedConference = true;
    if (this.addConferenceRoomForm.invalid ) {
      return;
    }
    this.addConferenceRoomForm.value.space = this.addConferenceRoomForm.value.space ?
      this.formatCurrencyToNumber(this.addConferenceRoomForm.value.space) : null;
    const obj = {id, ...this.addConferenceRoomForm.value};
    const updateConferenceRes = await this.configService.addConferenceRoom(obj);
    if (updateConferenceRes) {
      this.toastr.success(updateConferenceRes.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submittedConference = false;
      this.isConferenceEditEnabled = false;
      conferenceRoom.editable = false;
      this.getConferenceRoomDetails();
    }
  }

  formatCurrencyToNumber(value: any){
    const formattedVal = (value && typeof (value) === 'string')
    ? +(value.replace(/,/g, '')) : value;
    return formattedVal;
  }

  async addConferenceRoom(){
    this.submittedConference = true;
    if (this.addConferenceRoomForm.invalid ) {
      return;
    }
    this.addConferenceRowVar = false;
    this.addConferenceRoomForm.value.space = this.addConferenceRoomForm.value.space ?
      this.formatCurrencyToNumber(this.addConferenceRoomForm.value.space) : null;
    const obj = {...this.addConferenceRoomForm.value};
    const conferenceRes = await this.configService.addConferenceRoom(obj);
    if (conferenceRes) {
      this.toastr.success(conferenceRes.message, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.getConferenceRoomDetails();
      this.submittedConference = false;
    }
  }

  getProductType() {
    this.configService.getProductsType()
      .subscribe(
        (response) => {
          this.productType = response;
          // this.rerender();
        }, (error) => {
          console.error(error);
        });
  }

  getProducts(isFirstInit?: boolean) {
    this.addProductForm.reset();
    this.configService.getProducts()
      .subscribe(
        (response) => {
          this.data = response;
          if (isFirstInit) {
            this.dtTrigger2.next();
          } else {
            this.isProductEditEnabled = false;
            this.rerender();
          }
        }, (error) => {
          console.error(error);
        }, () => {
        });
  }

  updateProduct() {
    this.submitted = true;
    if (this.addProductForm.invalid) {
      return;
    }
    this.addProductForm.value.sqFootage = this.addProductForm.value.sqFootage ?
      this.formatCurrencyToNumber(this.addProductForm.value.sqFootage) : null;
    const productData = this.configService.updateProduct(this.addProductForm.value, this.products.product_id);
    productData.then(() => {
      this.toastr.success(CONFIG.SUCCESS_MSG.PRODUCT_UPDATED, '', {
        timeOut: 3000,
        closeButton: true
      });
      this.submitted = false;
      this.isProductEditEnabled = false;
      this.selectedItem.editable = false;
      this.getProducts();

    }, () => {

    });
  }


  conferenceEditEnable(conferenceRoom: any) {
    // this.addRowVar = false;
    // this.submitted = false;
    this.addConferenceRowVar = false;
    this.submittedConference = false;
    conferenceRoom.editable = !conferenceRoom.editable;
    this.isConferenceEditEnabled = true;
    this.setConferenceItemData(conferenceRoom);
    // conferenceRoom.currentSelected = true;
    // this.conferenceRooms = conferenceRoom;
    setTimeout(() => {
      this.addConferenceRoomForm.patchValue({
        name: conferenceRoom.conference_rooms_name,
        capacity: conferenceRoom.conference_rooms_capacity,
        space: conferenceRoom.conference_rooms_space,
        notes: conferenceRoom.conference_rooms_notes
      });
    }, 200);
  }

  editEnable(product: any) {
    this.addRowVar = false;
    this.submitted = false;
    product.editable = true;
    this.isProductEditEnabled = true;
    this.setItemData(product);
    this.products = product;

    setTimeout(() => {
      this.addProductForm.patchValue({
        productTypeId: product.product_productTypeId,
        name: product.product_name,
        description: product.product_description,
        sqFootage: product.product_sqFootage,
        totalQuantity: product.product_totalQuantity,
        cost: product.product_cost,
        recurrence: product.product_recurrence,

      });
    }, 200);
  }

  clearCost() {
    this.addProductForm.patchValue({
      cost: ''
    });
  }

  getConferenceRoomDetails(isFirstInit?: any) {
    this.configService.getConferenceRoom()
      .subscribe(
        (response: any) => {
          this.conferenceRooms = response.data;
          if (isFirstInit) {
            this.dtTrigger1.next();
          } else {
            this.rerender();
          }
        }, (error: any) => {
          console.error(error);
        });
  }

  async addRow() {
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.setDefaultValuesInFrom();
  }

  async addConferenceRow() {
    // for await (const item of this.data) {
    //   item.editable = false;
    // }
    // this.oldMonthDte = true;
    this.submittedConference = false;
    this.addConferenceRowVar = !this.addConferenceRowVar;
    this.setConferenceDefaultValuesInFrom();
  }

  dismissAddRow() {
    // this.addRowVar = false;
    // this.oldMonthDte = false;
  }

  ngAfterViewInit(): void {
    if (this.conferenceRooms.length){
      this.dtTrigger1.next();
    }
    if (this.products.length){
      this.dtTrigger2.next();
    }
    // this.rerender()
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
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

  printPage() {
    window.print();
  }
}
