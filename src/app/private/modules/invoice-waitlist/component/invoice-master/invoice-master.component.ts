import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-invoice-master',
  templateUrl: './invoice-master.component.html',
  styleUrls: ['./invoice-master.component.css']
})
export class InvoiceMasterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  range = '1';
  month = '';
  companyObj: any;
  maxDate = '';
  minDate = '';
  addInvoiceForm: any;
  oldMonthDte: boolean | undefined;
  minDateAddUpdate!: Date;
  maxDateAddUpdate!: Date;
  data: any;
  total = 0;
  dtOptions: any = {};
  masterTotal = 0;
  selectedSiteDetail: any;
  siteId = 0;
  globalDateFormat = environment.globalDateFormat;
  selectedFreezeDate: any;
  invoiceFreezeDate: any;


  constructor(
    private invoiceService: InvoiceService,
    private defaultDataService: DefaultDataService,
    private router: Router,
    private localStorage: LocalStorageService) {

  }

  ngOnInit(): void {
    this.siteId = this.localStorage.get('SELECTED_SITE');
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
    this.invoiceFreezeDate = this.selectedSiteDetail.invoiceFreezeDate || '01';
    const date = new Date();

    let month = parseInt(('0' + (date.getMonth() + 2)).slice(-2), 10);
    let year = date.getFullYear();
    if (month > 12) {
      month = 1;
      year = year + 1;
    }

    this.month = `${year}-${(month.toString().length == 1) ? '0' + month : month}`;

    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      ordering: false,
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
    this.getInvoiceByMonth();
  }

  initiateDataTable() {
    const siteName = 'Biolabs';
    this.dtOptions.buttons = [
      {
        extend: 'csv',
        footer: true,
        title: `${siteName} Report ${this.splitMonthYear()[1]}-${this.splitMonthYear()[0]}`,
      },
      {
        extend: 'print',
        footer: true,
        title: `${siteName} Report ${this.splitMonthYear()[1]}-${this.splitMonthYear()[0]}`,
      }
    ];
  }
  private splitMonthYear() {
    return (this.month.indexOf('-') > -1) ? this.month.split('-') : '';
  }


  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  /**
   * @description Get invoice Data by providing month
   */
  getInvoiceByMonth() {
    const selMonth = this.month;
    // const mothString = (selMonth.indexOf('-') > -1) ? selMonth.split('-') : '';
    // const currentMonth = (new Date()).getMonth();
    const futuredate = new Date().setMonth(new Date().getMonth() + 4);
    const mothString = this.splitMonthYear();
    const currentMonth = new Date().getTime();
    this.invoiceFreezeDate = this.selectedSiteDetail.invoiceFreezeDate || '01';
    const futureFreezeDate = new Date(futuredate).setDate(this.invoiceFreezeDate);
    const futureMonth = new Date(futureFreezeDate).getTime();
    this.selectedFreezeDate = new Date(this.month + '-' + this.invoiceFreezeDate);
    const selectedMonth = new Date(this.selectedFreezeDate).getTime();
    this.oldMonthDte = (selectedMonth >= currentMonth && selectedMonth <= futureMonth) ? false : true;
    // this.oldMonthDte = (currentMonth >= Number(mothString[1])) ? true : false;
    if (mothString && mothString[0] && mothString[1]) {
      this.getInvoiceData(Number(mothString[1]), Number(mothString[0]));
    }
  }

  /**
   * @description calculate last date of provided year and month.
   * @returns it retrn last date of provided year and month
   */
  lastday(y: number, m: number) {
    return new Date(y, m, 0).getDate();
  }

  private getInvoiceData(month: number, year: number) {
    const monthDays = this.lastday(year, month);
    this.initiateDataTable();
    this.invoiceService.getALLInvoiceByMonthAllSite(month, year, Number(this.range))
      .subscribe(
        (response) => {
          this.data = [];
          this.masterTotal = 0;
          const companyNameArr = [];
          let total = 0;
          for (const [i, orderProduct] of response.entries()) {
            orderProduct.startDate = (orderProduct.startDate) ?
              this.defaultDataService.dateWithoutTime(orderProduct.startDate) : null;
            orderProduct.endDate = (orderProduct.endDate) ?
              this.defaultDataService.dateWithoutTime(orderProduct.endDate) : null;
            orderProduct.showTotal = false;
            orderProduct.showCompanyName = true;
            if (orderProduct.productName && orderProduct.productName != null) {
              orderProduct.actualCost = this.calculatProRating(orderProduct, year, month, monthDays);
              total = total + orderProduct.actualCost;
              this.data.push(orderProduct);
            }
          }
          this.rerender();
        }, (error) => {
          console.error(error);
        });
  }

  public getProRatingDays(startDate: Date, endDate: Date) {
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

    let startDateMonth = null;
    let startDateYear = null;
    let startDate = new Date(year, month - 1, 1);
    let endDateMonth = null;
    let endDateYear = null;
    let endDate = new Date(year, month, 0);
    if (orderProduct.startDate) {
      startDateMonth = new Date(orderProduct.startDate).getMonth() + 1;
      startDateYear = new Date(orderProduct.startDate).getFullYear();
      startDate = (startDateMonth == month && startDateYear == year ) ? new Date(orderProduct.startDate) : startDate;
    } else {
      orderProduct.startDate = null;
    }
    if (orderProduct.endDate) {
      endDateMonth = new Date(orderProduct.endDate).getMonth() + 1;
      endDateYear = new Date(orderProduct.endDate).getFullYear();
      endDate = (endDateMonth == month && endDateYear == year) ? new Date(orderProduct.endDate) : endDate;
    } else {
      orderProduct.endDate = null;
    }
    if ((orderProduct.endDate && orderProduct.currentCharge && month == endDateMonth) ||
      (!orderProduct.endDate && orderProduct.currentCharge)
    ) {
      const proRatingDays = this.getProRatingDays(startDate, endDate);
      return (orderProduct.cost / monthDays) * orderProduct.quantity * Math.trunc(proRatingDays);
    } else {
      return 0;
    }
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
