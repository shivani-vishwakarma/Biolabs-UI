import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CONFIG, GLOBAL } from 'src/app/shared/utility/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResidentService } from 'src/app/core/services/resident.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate, formatNumber, getCurrencySymbol } from '@angular/common';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { DefaultDataService, inputDollarMasking } from 'src/app/shared/service/default-data.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { NgbCalendar, NgbDateAdapter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.css']
})
export class InvoicingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('d2') d2: NgbDatepicker | any;
  @ViewChild('d4') d4: NgbDatepicker | any;
  @ViewChild('d1') d1: NgbDatepicker | any;
  @ViewChild('d3') d3: NgbDatepicker | any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  numberMask = inputDollarMasking;
  submitted = false;
  dtOptions: any = {};
  orderID = 0;
  dtTrigger: Subject<any> = new Subject();
  month!: string;
  enableEditFlag = [];
  data: any[] = [];
  fDay: any;
  lDay: any;
  invoiceText = 'Biolabs';
  companyId = 0;
  addRowVar = false;
  total = 0;
  invoiceData: any;
  addInvoiceForm: FormGroup;
  selectedItem: any;
  companyObj: any;
  product: any;
  maxDate = '';
  minDate = '';
  oldMonthDte = false;
  nextPage: any;
  previousPage: any;
  productList!: OperatorFunction<string, readonly string[]>;
  productData: any = [];
  minDateAddUpdate!: Date;
  maxDateAddUpdate!: Date;
  productSelData: any;
  minCalenderDate!: string;
  globalDateFormat = environment.globalDateFormat;
  isSubmit = false;
  retainerPaidToDate: any = 0.00;
  todayDate = new Date();
  invoiceFreezeDate: any;
  selectedFreezeDate: any;
  // @ViewChild('instance', {static: true}) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  siteId = 0;
  siteData: any;
  current = 0;
  prev = -1;
  tempData: any = [];
  tempId: any = [];
  previosIndex: any;
  nextIndex: any;
  currentIndex: any;
  testData: any = [];
  minCalDate: any;
  modelStartDate: any;
  modelEndDate: any;
  selectedSiteDetail: any;
  isMonthGreater = false;
  constructor(
    public datepipe: DatePipe,
    private calendar: NgbCalendar,
    private configService: ConfigurationService,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private formBuilder: FormBuilder,
    private residentService: ResidentService,
    private defaultDataService: DefaultDataService,
    private localStorage: LocalStorageService,
    private toastr: ToastrService,
    private dateAdapter: NgbDateAdapter<any>,
    private router: Router) {
    this.addInvoiceForm = this.formBuilder.group({
      companyId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      productDescription: [''],
      startDate: [''],
      endDate: [''],
      month: 0,
      year: 0,
      quantity: [1, [Validators.required, Validators.minLength(0), Validators.pattern(new RegExp(CONFIG.REGEX.NUMBER))]],
      cost: ['', Validators.required],
      recurrence: [true],
      currentCharge: [true],
      manuallyEnteredProduct: true,
      productId: null,
    });
  }

  ngOnInit(): void {
    this.siteId = this.localStorage.get('SELECTED_SITE');
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.invoiceFreezeDate = this.selectedSiteDetail.invoiceFreezeDate || '01';
    // this.oldMonthDte
    const date = new Date();
    // BIOL-285:Default month for invoices should be the next month so adding 2 instead of 1
    let month = parseInt(('0' + (date.getMonth() + 2)).slice(-2), 10);
    let year = date.getFullYear();
    if (month > 12) {
      month = 1;
      year = year + 1;
    }
    this.month = `${year}-${(month.toString().length == 1) ? '0' + month : month}`;
    // this.minCalenderDate = `${year}-${month}-01`;
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      // columnDefs: [{ orderable: false, targets: 9 }],
      ordering: true,
      buttons: [
        {
          extend: 'csv',
          footer: true,
        },
        {
          extend: 'print',
          footer: true,
        }
      ]
    };
    if (this.getRole() == 1 || this.getRole() == 2) {
      this.dtOptions.columnDefs = [{ orderable: false, targets: 9 }];
    }
    this.minCalDate = {
      year: Number(year),
      month: Number(`0${month}`),
      day: Number('01')
    };
    this.retainerPaidToDate = formatNumber(this.retainerPaidToDate, 'en-us', '1.2-2');
    this.checkMonthGreaterThanCurrent(this.minCalDate.year, this.minCalDate.month);
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        this.companyId = params.id;
        this.getCompanById(this.companyId);
      });
    }
    this.getInvoiceByMonth(true);
    // this.getAllInvoicesByMonth();

  }
  // this.getInvoiceByMonth(true);
  // this.getAllInvoicesByMonth();
  getCurrency(currency: any) {
    return getCurrencySymbol(currency, 'wide');
  }

  previous(id: number) {
    this.companyId = id;
    this.router.navigate([`resident-companies/${this.companyId}/invoicing`]);
    this.getInvoiceByMonth();
    this.getCompanyDetails(id);
  }

  next(id: number) {
    this.companyId = id;
    this.router.navigate([`resident-companies/${this.companyId}/invoicing`]);
    this.getInvoiceByMonth();
    this.getCompanyDetails(id);
  }

  getCompanyDetails(id: any) {
    const set = new Set();
    for (let i = 1; i < this.tempData.length; i++) {
      if (this.tempData[i].companyid !== 0) {
        set.add(this.tempData[i].companyid);
      }
    }
    this.tempId = [];
    set.forEach(setId => {
      if (setId) {
        this.tempId.push(setId);
      }
    });
    if (this.tempId && this.tempId.length) {
      const index = this.tempId.indexOf(parseInt(id, 10));
      if (!index) {
        this.previosIndex = 0;
      } else {
        this.previosIndex = this.tempId[index - 1];
      }
      if ([index + 1] < this.tempId.length) {
        this.nextIndex = this.tempId[index + 1];
      } else {
        this.nextIndex = 0;
      }
      this.getCompanById(id);
    }
  }

  initiateDataTable() {
    const companyName = (this.companyObj && this.companyObj.companyName) ? this.companyObj.companyName : 'Biolabs';
    this.dtOptions.buttons = [
      {
        extend: 'csv',
        footer: true,
        title: `${companyName} Report ${this.splitMonthYear()[1]}-${this.splitMonthYear()[0]}`,
      },
      {
        extend: 'print',
        footer: true,
        title: `${companyName} Report ${this.splitMonthYear()[1]}-${this.splitMonthYear()[0]}`,
      }
    ];
  }

  setValueInRow(item: any) {
    const pNAme = (item.item) ? item.item : this.addInvoiceForm.value.productName;
    if (pNAme) {
      this.productSelData = this.productData.filter((pilot: any) => pilot.product_name.trim() == pNAme.trim());
      if (this.productSelData && this.productSelData.length > 0) {
        const productItem = this.productSelData[0];
        this.resetInvoiceForm(productItem.product_id, productItem.product_name,
          productItem.product_description, productItem.product_cost,
          productItem.product_recurrence, false);
      } else {
        this.addInvoiceForm.patchValue({
          manuallyEnteredProduct: true,
          productId: null
        });
      }
    }
  }

  getProducts: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !true));
    const inputFocus$ = this.focus$;
    let data: any = [];
    this.configService.getProducts().subscribe(res => {
      data = res.map((product: any) => {
        this.productData = res;
        return product.product_name;
      });
    }, err => console.log(err));
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? data
        : data.filter((v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  setItemData(item: any) {
    this.selectedItem = item;
  }

  checkIsmanual() {
    const pNAme = this.addInvoiceForm.value.productName;
    this.productSelData = this.productData.filter((pilot: any) => pilot.product_name.trim() == pNAme.trim());
    if (this.productSelData.length == 0) {
      this.addInvoiceForm.patchValue({
        manuallyEnteredProduct: true,
        productId: null
      });
    } else {
      this.addInvoiceForm.patchValue({
        manuallyEnteredProduct: false,
        productId: this.productSelData[0].product_id
      });
    }
  }

  /**
   * @description : Get company application by application id
   * Description : Get company application by application id
   * @param id applicationId
   */
  getCompanById(id: any) {
    const company = this.residentService.getCompanyById(this.companyId);
    company.subscribe((resp) => {
      this.companyObj = resp;
      this.initiateDataTable();
    }, (error) => {
      /** Navigate to error page when found status code 406 */
      if (error.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
      console.error('Error in getting applications', error);
    });
  }

  deleteItem() {
    this.invoiceService.deleteProduct(this.selectedItem.order_product_id).subscribe((response) => {
      this.getInvoiceByMonth();
      this.rerender();
    }, (error) => {
      console.error(error);
    });
  }

  /**
   * @description calculate last date of provided year and month.
   * @returns it retrn last date of provided year and month
   */
  lastday(y: number, m: number) {
    return new Date(y, m, 0).getDate();
  }

  /**
   * @description Get invoice Data by providing month
   */
  getInvoiceByMonth(allInvoice?: boolean) {
    this.addInvoiceForm.reset();
    const futuredate = new Date().setMonth(new Date().getMonth() + 4);
    const mothString = this.splitMonthYear();
    const currentMonth = new Date().getTime();
    this.invoiceFreezeDate = this.selectedSiteDetail.invoiceFreezeDate || '01';
    const futureFreezeDate = new Date(futuredate).setDate(this.invoiceFreezeDate);
    const futureMonth = new Date(futureFreezeDate).getTime();
    this.selectedFreezeDate = new Date(this.month + '-' + this.invoiceFreezeDate);
    const selectedMonth = new Date(this.selectedFreezeDate).getTime();
    this.oldMonthDte = (selectedMonth >= currentMonth && selectedMonth <= futureMonth) ? false : true;
    // this.minCalenderDate = `${Number(mothString[0])}-${Number(mothString[1])}-01`;
    this.minCalDate = {
      year: Number(mothString[0]),
      month: Number(mothString[1]),
      day: Number('01')
    };
    this.checkMonthGreaterThanCurrent(this.minCalDate.year, this.minCalDate.month);
    if (mothString[0] && mothString[1]) {
      if (allInvoice) {
        this.getAllInvoice(Number(mothString[1]), Number(mothString[0]));
        this.getInvoiceData(Number(mothString[1]), Number(mothString[0]));
      } else {
        this.getInvoiceData(Number(mothString[1]), Number(mothString[0]));
      }
    }
  }

  private splitMonthYear() {
    return (this.month.indexOf('-') > -1) ? this.month.split('-') : '';
  }
  checkMonthGreaterThanCurrent(selectedYear: number, selectedMonth: number) {
    const currentDate = new Date();
    const selectedDate = new Date(selectedYear, selectedMonth);
    let month = currentDate.getMonth() + 1;
    if (currentDate.getMonth() == 12) {
      month = 1;
    } else {
      month += 1;
    }
    const currentYearMonth = new Date(currentDate.getFullYear(), month);
    if (selectedDate && currentYearMonth) {
      this.isMonthGreater = selectedDate > currentYearMonth;
    }
  }
  /**
   * Description this is setting default value in form
   * @description
   * @param product_id product_id
   * @param productName productName
   * @param productDescription productDescription
   * @param cost cost
   * @param recurrence recurrence
   * @param manuallyEnteredProduct manuallyEnteredProduct
   */
  private resetInvoiceForm(
    pId: any,
    pName: string,
    pDescription: string,
    costMonthly: number,
    recurrences: boolean,
    manuallyEnteredP: boolean
  ) {
    const mothString = (this.month.indexOf('-') > -1) ? this.month.split('-') : '';
    setTimeout(() => {
      this.addInvoiceForm.patchValue({
        recurrence: recurrences,
        companyId: this.companyId,
        currentCharge: true,
        month: Number(mothString[1]),
        year: Number(mothString[0]),
        manuallyEnteredProduct: manuallyEnteredP,
        productName: pName,
        productDescription: pDescription,
        quantity: 1,
        cost: costMonthly,
        productId: pId
      });
    }, 200);
  }

  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }

  checkStartDate() {
    const parserDate = this.addInvoiceForm.controls.startDate.value;
    const parsedStartDate = this.formatParseDate(parserDate);
    const selstartDate = (parsedStartDate) ? new Date(`${parsedStartDate} 00:00:00`)
      : this.minDateAddUpdate;
    if (selstartDate && (selstartDate > this.maxDateAddUpdate) || (selstartDate < this.minDateAddUpdate)) {
      this.addInvoiceForm.controls.startDate.setErrors({ incorrect: true });
    }
  }

  checkEndDate() {
    const parserDate = this.addInvoiceForm.controls.startDate.value;
    const parsedStartDate = this.formatParseDate(parserDate);
    const parserendDate = this.addInvoiceForm.controls.endDate.value;
    const parsedEndDate = this.formatParseDate(parserendDate);
    const selEndDate = (parsedEndDate) ? new Date(`${parsedEndDate} 00:00:00`)
      : this.maxDateAddUpdate;
    const selstartDate = (parsedStartDate) ? new Date(`${parsedStartDate} 00:00:00`)
      : this.minDateAddUpdate;
    if (selEndDate && (selEndDate < selstartDate) || (selEndDate > this.maxDateAddUpdate) || (selEndDate < this.minDateAddUpdate)) {
      this.addInvoiceForm.controls.endDate.setErrors({ incorrect: true });
    }
  }

  public getProRatingDays(startDate: Date, endDate: Date) {
    // const time = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate())
    //   .getTime() - new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate())
    //     .getTime();
    // return (time / (1000 * 3600 * 24)) + 1;
    const time: any = this.daysBetween(startDate, endDate);
    return time + 1;
  }

  treatAsUTC(date: any) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  daysBetween(startDate: any, endDate: any) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const dta: any = this.treatAsUTC(endDate);
    const sta: any = this.treatAsUTC(startDate);
    return (dta - sta) / millisecondsPerDay;
  }

  calculatProRating(orderProduct: any, year: number, month: number, monthDays: any): any {

    if ((orderProduct.endDate && orderProduct.currentCharge &&
      month == new Date(orderProduct.endDate).getMonth() + 1) ||
      (!orderProduct.endDate && orderProduct.currentCharge)
    ) {
      const start = (orderProduct.startDate &&
        (new Date(orderProduct.startDate).getMonth() + 1) == month) ?
        new Date(orderProduct.startDate) : new Date(year, month - 1, 1);

      const end = (orderProduct.endDate &&
        (new Date(orderProduct.endDate).getMonth() + 1) == month) ?
        new Date(orderProduct.endDate) :
        new Date(year, month - 1, monthDays);

      const proRatingDays = this.getProRatingDays(start, end);

      return (orderProduct.cost / monthDays) * orderProduct.quantity * Math.trunc(proRatingDays);
    } else {
      return 0;
    }
  }

  private getAllInvoice(month: number, year: number) {
    const monthDays = this.lastday(year, month);
    this.invoiceService.getALLInvoiceByMonth(month, year).subscribe(response => {
      const companyNameArr = [];
      let total = 0;
      for (const [i, orderProduct] of response.entries()) {
        orderProduct.startDate = (orderProduct.startDate) ?
          this.defaultDataService.dateWithoutTime(orderProduct.startDate) : null;
        orderProduct.endDate = (orderProduct.endDate) ?
          this.defaultDataService.dateWithoutTime(orderProduct.endDate) : null;
        const companyJson: any = { companyid: '', showTotal: false, showCompanyName: false, companyName: '' };
        orderProduct.showTotal = false;
        orderProduct.showCompanyName = false;
        companyJson.companyid = orderProduct.companyid;
        if (companyNameArr.indexOf(orderProduct.companyName) == -1) {
          companyNameArr.push(orderProduct.companyName);
          if (i > 0) {
            /**
             * JSON for Total Row
             */
            const totalJson: any = { total: '' };
            totalJson.total = total;
            this.testData.push(totalJson);
            total = 0;
          }
          /**
           * Setting Company Empty Row
           */
          companyJson.showTotal = false;
          companyJson.showCompanyName = true;
          companyJson.companyName = orderProduct.companyName;
          this.testData.push(companyJson);
        }
        if (orderProduct.productName && orderProduct.productName != null) {
          orderProduct.actualCost = this.calculatProRating(orderProduct, year, month, monthDays);
          total = total + orderProduct.actualCost;
          this.testData.push(orderProduct);
        }
        if (i + 1 == response.length) {
          /**
           * JSON for Total Row
           */
          const totalJson: any = { total: '' };
          totalJson.total = total;
          this.testData.push(totalJson);
        }
      }
      this.tempData = this.testData;
      this.getCompanyDetails(this.companyId);
    }, (error) => {
      console.error(error);
    });
  }
  private getInvoiceData(month: number, year: number) {
    this.initiateDataTable();
    this.invoiceService.getInvoiceByMonth(this.companyId, month, year).subscribe((response) => {
      if (response && response.retainer) {
        if (!this.retainerPaidToDate) {
          this.retainerPaidToDate = formatNumber(0.00, 'en-us', '1.2-2');
        } else {
          this.retainerPaidToDate = response.retainer.retainerPaidToDate;
          this.retainerPaidToDate = formatNumber(this.retainerPaidToDate, 'en-us', '1.2-2');
          this.retainerPaidToDate = (this.retainerPaidToDate && typeof (this.retainerPaidToDate) === 'string')
            ? (this.retainerPaidToDate.replace(/,/g, '')) : this.retainerPaidToDate;
        }
      } else {
        this.retainerPaidToDate = formatNumber(0.00, 'en-us', '1.2-2');
        this.onRetainerBlur();
      }
      this.data = [];
      this.total = 0;
      const monthDays = this.lastday(year, month);

      for (const orderProduct of response.orderProducts) {
        let startDateMonth = null;
        let startDateYear = null;
        let startDate = new Date(year, month - 1, 1);
        let endDateMonth = null;
        let endDateYear = null;
        let endDate = new Date(year, month, 0);
        if (orderProduct.order_product_startDate) {
          orderProduct.order_product_startDate = this.defaultDataService.dateWithoutTime(orderProduct.order_product_startDate);
          startDateMonth = new Date(orderProduct.order_product_startDate).getMonth() + 1;
          startDateYear = new Date(orderProduct.order_product_startDate).getFullYear();
          startDate = (startDateMonth == month && startDateYear == year ) ? new Date(orderProduct.order_product_startDate) : startDate;
        } else {
          orderProduct.order_product_startDate = null;
        }
        if (orderProduct.order_product_endDate) {
          orderProduct.order_product_endDate = this.defaultDataService.dateWithoutTime(orderProduct.order_product_endDate);
          endDateMonth = new Date(orderProduct.order_product_endDate).getMonth() + 1;
          endDateYear = new Date(orderProduct.order_product_endDate).getFullYear();
          endDate = (endDateMonth == month && endDateYear == year) ? new Date(orderProduct.order_product_endDate) : endDate;
        } else {
          orderProduct.order_product_endDate = null;
        }
        orderProduct.editable = false;
        if ((orderProduct.order_product_endDate && orderProduct.order_product_currentCharge &&
          month == endDateMonth) ||
          (!orderProduct.order_product_endDate && orderProduct.order_product_currentCharge)
        ) {
          const proRatingDays = this.getProRatingDays(startDate, endDate);
          const actualCost = (orderProduct.order_product_cost / monthDays) *
            orderProduct.order_product_quantity * Math.trunc(proRatingDays);

          orderProduct.actualCost = actualCost;
          this.total = actualCost + this.total;
        }
        this.data.push(orderProduct);
      }
      this.rerender();
    }, (error) => {
      /** Navigate to error page when found status code 406 */
      if (error.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
      console.error(error);
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addInvoiceForm.controls; }

  /**
   * @description add product in invoice.
   * @returns void
   */
  async onSubmit() {
    this.isSubmit = true;
    this.submitted = true;
    this.checkStartDate();
    this.checkEndDate();
    this.checkIsmanual();
    this.addInvoiceForm.value.startDate = this.formatParseDate(this.addInvoiceForm.value.startDate);
    this.addInvoiceForm.value.endDate = this.formatParseDate(this.addInvoiceForm.value.endDate);
    if (this.addInvoiceForm.invalid) {
      this.isSubmit = false;
      return;
    }
    let obj = { ...this.addInvoiceForm.value, ...{ submittedDate: this.month + '-01' } };
    const monthDays = this.lastday(obj.year, obj.month);
    const monthlyCost = this.calculatProRating(obj, obj.year, obj.month, monthDays);
    obj = { ...obj, ...{ monthlyCost } };
    const productData = this.invoiceService.addProduct(obj);
    productData.then(data => {
      if (data.status == 'error') {
        this.toastr.error(data.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      } else {
        this.toastr.success(CONFIG.SUCCESS_MSG.ADD_PRODUCT, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
      this.submitted = false;
      this.getInvoiceByMonth();
    }, (error) => {
      this.submitted = false;
      const message = error ? error.message : 'Something went wrong while adding product..!';
      this.toastr.error(message, '', {
        timeOut: 3000,
        closeButton: true
      });

    });
  }

  updateProduct() {
    this.isSubmit = true;
    this.submitted = true;
    this.checkStartDate();
    this.checkEndDate();
    this.checkIsmanual();
    const parsedStartDate = this.formatParseDate(this.addInvoiceForm.value.startDate);
    const parsedEndDate = this.formatParseDate(this.addInvoiceForm.value.endDate);
    const startD = (this.addInvoiceForm.value.startDate == '') ? null : parsedStartDate;
    const endD = (this.addInvoiceForm.value.endDate == '') ? null : parsedEndDate;
    if (this.addInvoiceForm.invalid) {
      this.isSubmit = false;
      return;
    }
    this.addInvoiceForm.value.startDate = startD;
    this.addInvoiceForm.value.endDate = endD;
    let obj = { ...this.addInvoiceForm.value };
    const monthDays = this.lastday(obj.year, obj.month);
    const monthlyCost = this.calculatProRating(obj, this.addInvoiceForm.value.year, this.addInvoiceForm.value.month, monthDays);
    obj = { ...obj, ...{ monthlyCost } };
    const productData = this.invoiceService.updateProduct(obj, this.product.order_product_id);
    productData.then(data => {
      if (data.status == 'error') {
        this.toastr.error(data.message, '', {
          timeOut: 3000,
          closeButton: true
        });
      } else {
        this.toastr.success(CONFIG.SUCCESS_MSG.UPDATE_PRODUCT, '', {
          timeOut: 3000,
          closeButton: true
        });
      }
      this.submitted = false;
      this.getInvoiceByMonth();
    }, (error) => {
      this.submitted = false;
      const message = error ? error.message : CONFIG.ERROR_MSG.UPDATE_PRODUCT;
      this.toastr.error(message, '', {
        timeOut: 3000,
        closeButton: true
      });
    });
  }

  async editEnable(invoice: any, i: number) {
    this.addRowVar = false;
    this.submitted = false;
    for await (const invoiceObj of this.data) {
      invoiceObj.editable = false;
    }
    this.oldMonthDte = true;
    invoice.editable = true;
    this.product = invoice;
    this.setStartDateMaxMinValue();
    const parserStartDate: any = (invoice.order_product_startDate) ?
      this.datepipe.transform(new Date(invoice.order_product_startDate), 'yyyy-MM-dd') : null;
    const parsedStartDate = parserStartDate ? parserStartDate.split('-') : null;
    const parserEndDate: any = (invoice.order_product_endDate) ?
      this.datepipe.transform(new Date(invoice.order_product_endDate), 'yyyy-MM-dd') : null;
    const parsedEndDate = parserEndDate ? parserEndDate.split('-') : null;
    const startDTUPT = (invoice.order_product_startDate) ? this.dateAdapter.toModel({
      day: parsedStartDate[2],
      month: parsedStartDate[1],
      year: parsedStartDate[0]
    }) : null;
    const endDTUPT = (invoice.order_product_endDate) ? this.dateAdapter.toModel({
      day: parsedEndDate[2],
      month: parsedEndDate[1],
      year: parsedEndDate[0]
    }) : null;
    setTimeout(() => {
      this.addInvoiceForm.patchValue({
        startDate: startDTUPT,
        endDate: endDTUPT,
        companyId: this.companyId,
        productName: invoice.order_product_productName,
        productDescription: invoice.order_product_productDescription,
        quantity: invoice.order_product_quantity,
        cost: invoice.order_product_cost,
        recurrence: invoice.order_product_recurrence,
        currentCharge: invoice.order_product_currentCharge,
        month: invoice.order_product_month,
        year: invoice.order_product_year,
        manuallyEnteredProduct: invoice.order_product_manuallyEnteredProduct,
      });
    }, 200);
  }

  dismissEditRow() {
    for (const item of this.data) {
      item.editable = false;
    }
    this.oldMonthDte = false;
  }

  dismissAddRow() {
    this.modelEndDate = null;
    this.modelStartDate = null;
    this.addRowVar = false;
    this.oldMonthDte = false;
  }

  async addRow() {
    for await (const item of this.data) {
      item.editable = false;
    }
    this.oldMonthDte = true;
    this.submitted = false;
    this.addRowVar = !this.addRowVar;
    this.addInvoiceForm.reset();
    this.setStartDateMaxMinValue();
    this.resetInvoiceForm(null, '', '', 0, true, true);
  }


  private setStartDateMaxMinValue() {
    const selectDate = new Date(`${this.month.toString()}-01 00:00:00`);
    const m = ('0' + (selectDate.getMonth())).slice(-2);
    const y = selectDate.getFullYear();

    this.minDateAddUpdate = new Date(`${y}-${Number(m) + 1}-01`);
    // this.minDateAddUpdate = this.defaultDataService.dateWithoutTime(this.minDateAddUpdate);
    this.maxDateAddUpdate = new Date(`${y}-${Number(m) + 1}-${this.lastday(Number(y), Number(m) + 1)}`);
    // this.maxDateAddUpdate = this.defaultDataService.dateWithoutTime(this.maxDateAddUpdate);
  }

  async onRetainerBlur(event?: any) {
    this.retainerPaidToDate = (this.retainerPaidToDate && typeof (this.retainerPaidToDate) === 'string')
      ? +(this.retainerPaidToDate.replace(/,/g, '')) : this.retainerPaidToDate;
    const obj = {
      companyId: Number(this.companyId),
      month: this.splitMonthYear() ? Number(this.splitMonthYear()[1]) : null,
      year: this.splitMonthYear() ? Number(this.splitMonthYear()[0]) : null,
      retainerPaidToDate: Number(this.retainerPaidToDate) || this.retainerPaidToDate
    };
    const res = await this.invoiceService.addRetainerPaidToDate(obj);
    if (res) {
      this.retainerPaidToDate = formatNumber(this.retainerPaidToDate, 'en-us', '1.2-2');
      this.retainerPaidToDate = (this.retainerPaidToDate && typeof (this.retainerPaidToDate) === 'string')
        ? (this.retainerPaidToDate.replace(/,/g, '')) : this.retainerPaidToDate;
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  toggleDate(event?: any, ref?: any) {
    // const nextMonth = this.calendar.getNext(this.calendar.getToday(), 'm', 1);
    const nextMonth: any = this.month ? this.month.split('-') : null;
    const toggler = (ref === 'd2' ? this.d2 : this.d4) || (ref === 'd3' ? this.d3 : this.d1);
    toggler.toggle();
    toggler.navigateTo({
      year: nextMonth ? Number(nextMonth[0]) : null,
      month: nextMonth ? Number(nextMonth[1]) : null
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.addRowVar = false;
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
