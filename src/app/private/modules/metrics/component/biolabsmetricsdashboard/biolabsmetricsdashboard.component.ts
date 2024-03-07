import { AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { DateValidator, GLOBAL } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from '../../../configurations/configuration.service';
import { MetricsService } from '../../services/metrics.service';

export type occupancyByRevenue = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

export type companySizeGraph = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type numberOfMembers = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

export type graduateCompanies = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

export type currentCompanies = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

export type sumOfFundRaised = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type totalRevenueByTypeChart = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type totalPercentageByTypeChart = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

export type companyTypes = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type fundingRaised = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};

@Component({
  selector: 'app-biolabsmetricsdashboard',
  templateUrl: './biolabsmetricsdashboard.component.html',
  styleUrls: ['./biolabsmetricsdashboard.component.css']
})
export class BiolabsmetricsdashboardComponent implements OnInit, AfterViewInit {

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective> | any;
  dtTrigger: Subject<any> = new Subject();
  public occupancyByRevenue: Partial<occupancyByRevenue> | any;
  public companySizeGraph: Partial<companySizeGraph> | any;
  public numberOfMembers: Partial<numberOfMembers> | any;
  public companyTypes: Partial<companyTypes> | any;
  public fundingRaised: Partial<fundingRaised> | any;
  public graduateCompanies: Partial<graduateCompanies> | any;
  public currentCompanies: Partial<currentCompanies> | any;
  public sumOfFundRaised: Partial<sumOfFundRaised> | any;
  public totalPercentageByTypeChart: Partial<totalPercentageByTypeChart> | any;
  public totalRevenueByTypeChart: Partial<totalRevenueByTypeChart> | any;
  totalOccupancyByRevenue: any;
  biolabsCompanySize: any;
  noOfMembersAndFundRaisedSum: any;
  currentandgraduatecompanies: any;
  // siteDemographics: any;
  // occupancyByRevenueAndPercentagetype
  totalRevenueByTypeRes: any;
  totalPercentByTypeRes: any;
  companyTypesAndFundRaised: any;
  averageData: any;
  dtOptions: any = {};
  addRowVar = false;
  submitted = false;
  biolabsMetricsDashboardForm: any;
  businessMetrics: any;
  isMetricsEditEnabled = false;
  selectedBusinessItem: any;
  selectedSiteDetail: any;
  sitesList: any = [];
  productType: any;
  productTypeIdForRevenue: any = 99;
  productTypeIdForPercent: any = 99;
  isDateValid = {startDate: true, endDate: true};
  globalDateFormat = environment.globalDateFormat;

  constructor(
    private metricsService: MetricsService,
    private datepipe: DatePipe,
    private dateAdapter: NgbDateAdapter<any>,
    private ngbCalendar: NgbCalendar,
    private defaultDataService: DefaultDataService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private configService: ConfigurationService
    ) {
    this.selectedSiteDetail = localStorageService.get('SELECTED_SITE_DETAIL');
    this.biolabsMetricsDashboardForm = {
      // startDate: null,
      startDate: ['', [Validators.required, DateValidator()]],
      endDate: null,
      totalSiteSquarefeet: '',
      totalOfficeSquarefeet: null,
      totalLabSquarefeet: null,
      totalEquipmentValue: null,
      totalWorkstationSquarefeet: null,
      totalLabBenchSquarefeet: null
    };
    this.getProductType();
    this.occupancyByRevenue = {
      series: [

      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        dashArray: [0, 2],
        width: [2, 2]
      },
      fill: {
        type: 'solid',
        opacity: [0.20, 1],
      },
      grid: {
        show: true
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (value: any) => {
              const currencySign = getCurrencySymbol('USD', 'wide');
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
            }
          },
          title: {
            text: 'Revenue',
            style: {
              fontWeight:  400,
            },
          },
        }
      ]
    };

    this.companySizeGraph = {
      series: [
      ],
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        type: 'bar',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 0, 0]
      },
      plotOptions: {
        bar: {
          columnWidth: '30%'
        }
      },
      xaxis:
      {
        categories: [],
        labels: {
          show: true,
        },
        title: {
          text: 'Company Size Bucket',
          style: {
            fontWeight:  400
          },
        }
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight:  400
            },
          }
        }
      ],

      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
    this.numberOfMembers = {
      series: [
      ],
      chart: {
        height: 350,
        type: 'area',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
        // show: false
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Members',
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };

    this.graduateCompanies = {
      series: [
      ],
      chart: {
        height: 350,
        type: 'area',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
        // show: false
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };

    this.sumOfFundRaised = {
      series: [
      ],
      chart: {
        height: 350,
        type: 'area',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
        // show: false
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (value: any) => {
              const currencySign = getCurrencySymbol('USD', 'wide');
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
            }
          },
          title: {
            text: 'Fundraising',
            offsetX: 5,
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };

    this.currentCompanies = {
      series: [
      ],
      chart: {
        height: 350,
        type: 'area',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
        // show: false
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };
    this.totalRevenueByTypeChart = {
      series: [
      ],
      colors: ['#6baecf', '#26294a', '#d80c8c', '#4b0278', '#f8ab73', '#f8ab73', '#771696', '#c64e4e', '#c64e4e', '#f7802a', '#007f46', '#146867', '#0c3c60', '#0f9792'],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
        // show: false
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (value: any) => {
              const currencySign = getCurrencySymbol('USD', 'wide');
              // if(value > 1000){
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
              // }
              // return  currencySign + value;
            }
          },
          title: {
            text: 'Total Revenue',
            offsetX: 5,
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };
    this.totalPercentageByTypeChart = {
      series: [

      ],
      colors: ['#6baecf', '#26294a', '#d80c8c', '#4b0278', '#f8ab73', '#f8ab73', '#771696', '#c64e4e', '#c64e4e', '#f7802a', '#007f46', '#146867', '#0c3c60', '#0f9792'],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: [2]
      },
      grid: {
        show: true
      },
      xaxis: {
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
          },
          title: {
            text: 'Occupancy',
            style: {
              fontWeight:  400
            },
          }
        }
      ]
    };
    this.fundingRaised = {
      series: [
      ],
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        type: 'bar',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 0, 0]
      },
      plotOptions: {
        bar: {
          columnWidth: '30%'
        }
      },
      xaxis:
      {
        categories: [],
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight:  400
            },
          }
        }
      ],

      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
    this.companyTypes = {
      series: [],
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        type: 'bar',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2, 0, 0]
      },
      plotOptions: {
        bar: {
          columnWidth: '30%'
        }
      },
      xaxis:
      {
        categories: [],
      },
      yaxis: [
        {
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight:  400
            },
          }
        }
      ],

      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
   }

  ngOnInit(): void {
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'Bfrtip',
      ordering: true,
      buttons: [
      ],
    };
    const startDate = new Date().getFullYear() + '-' + '01' + '-' + '01';
    this.biolabsMetricsDashboardForm.startDate = '01' + '-' + '01' + '-' + new Date().getFullYear();
    this.biolabsMetricsDashboardForm.endDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    const endDate: any = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    // this.getSitesList(startDate, endDate);
    this.getBiolabsMetrics(startDate, endDate);
  }

  // async getSitesList(startDate: any, endDate: any){
  //   if (!this.sitesList.length) {
  //     this.sitesList = await this.defaultDataService.getSiteList();
  //   }
  // }

  async getBusinessMetrics(startDate: any, endDate: any){
    this.metricsService.getBusinessMetrics(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.businessMetrics = res;
      if (this.businessMetrics.siteConfigData.length) {
        this.businessMetrics.siteConfigData.map((item: any) => {
          item.siteName = this.getSiteName(item.id);
        });
      }
      this.rerender();
    });
  }

  async getBiolabsMetrics(startDate: any, endDate: any){
    this.sitesList = await this.defaultDataService.getSiteList();
    this.getTotalOccupancyByRevenue(startDate, endDate);
    this.getBiolabsCompanySize(startDate, endDate);
    this.getBiolabsNoOfMembersAndFundRaisedSum(startDate, endDate);
    this.getBiolabsCurrentandgraduatecompanies(startDate, endDate);
    this.getBiolabsTotalRevenueByType(startDate, endDate);
    this.getBiolabsTotalPercentageByType(startDate, endDate);
    this.getBiolabsCompanyTypesAndFundRaised(startDate, endDate);
    this.getBiolabsAvgData(startDate, endDate);
    this.getBusinessMetrics(startDate, endDate);
  }

  getTotalOccupancyByRevenue(startDate: any, endDate: any){
    this.metricsService.getBiolabsTotalOccupancyByRevenue(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.totalOccupancyByRevenue = res;
      this.bindOccupancyByRevenueGraph();
    });
  }

  getBiolabsCompanySize(startDate: any, endDate: any){
    this.metricsService.getBiolabsCompanySize(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.biolabsCompanySize = res;
      this.bindCompanySizeGraph();
    });
  }

  getBiolabsNoOfMembersAndFundRaisedSum(startDate: any, endDate: any){
    this.metricsService.getBiolabsNoOfMembersAndFundRaisedSum(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.noOfMembersAndFundRaisedSum = res;
      this.bindNumberOfMembers();
      this.bindSumOfFundRaised();
    });
  }
  getBiolabsCurrentandgraduatecompanies(startDate: any, endDate: any){
    this.metricsService.getBiolabsCurrentandgraduatecompanies(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.currentandgraduatecompanies = res;
      this.bindCurrentCompanies();
      this.bindGraduateCompanies();
    });
  }

  getBiolabsTotalRevenueByType(startDate: any, endDate: any){
    this.metricsService.getBiolabsTotalRevenueByType(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.totalRevenueByTypeRes = res;
      this.bindTotalRevenueByType();
    });
  }
  getBiolabsTotalPercentageByType(startDate: any, endDate: any){
    this.metricsService.getBiolabsTotalPercentageByType(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.totalPercentByTypeRes = res;
      this.bindPercentageOccupancyByType();
    });
  }
  getBiolabsCompanyTypesAndFundRaised(startDate: any, endDate: any){
    this.metricsService.getBiolabsCompanyTypesAndFundRaised(startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.companyTypesAndFundRaised = res;
      this.bindCompanyTypesData();
      this.bindFundRaised();
    });
  }

  getBiolabsAvgData(startDate: any, endDate: any){
    this.metricsService.getBiolabsAvgData(startDate, endDate).subscribe(res => {
      if (!res) {
        this.averageData = null;
        return;
      }
      this.averageData = res;
    });
  }

  getProductType() {
    this.productType = [{
      id: 2, productTypeName: 'Lab Bench', createdBy: 1, modifiedBy: 1,
      createdAt: '2021-07-01T10:55:41.482Z', modifiedAt: '2021-07-01T10:55:41.482Z'
    },
    {
      id: 3, productTypeName: 'Workstation', createdBy: 1, modifiedBy: 1,
      createdAt: '2021-07-01T10:55:41.492Z', modifiedAt: '2021-07-01T10:55:41.492Z'
    },
    {
      id: 4, productTypeName: 'Private Office', createdBy: 1, modifiedBy: 1,
      createdAt: '2021-07-01T10:55:41.505Z', modifiedAt: '2021-07-01T10:55:41.505Z'
    },
    {
      id: 5, productTypeName: 'Private Lab', createdBy: 1, modifiedBy: 1,
      createdAt: '2021-07-01T10:55:41.514Z', modifiedAt: '2021-07-01T10:55:41.514Z'
    },
    { id: 99, productTypeName: 'All' }];
    // this.configService.getProductsType()
    //   .subscribe(
    //     (response: any) => {
    //       this.productType = response;
    //       // this.rerender();
    //     }, (error: any) => {
    //       console.error(error);
    //     });
  }

  bindOccupancyByRevenueGraph() {
    let categoriesArr: any = [];
    let displayZero = false;
    let sumData: any = [];
    let prData: any = [];
    if (this.totalOccupancyByRevenue && this.totalOccupancyByRevenue.totalOccupanyByRevenue
      && this.totalOccupancyByRevenue.totalOccupanyByRevenue.length) {
      this.totalOccupancyByRevenue.totalOccupanyByRevenue.forEach((element: any) => {
        if ((element.sum && element.sum != 0 || element.pr && element.pr != 0) || displayZero) {
          displayZero = true;
          categoriesArr = categoriesArr.concat(element.mon);
          sumData = sumData.concat(element.sum);
          prData = prData.concat(element.pr);
        }
      });
      if (!sumData.length && !prData.length) {
        return;
      }
      this.occupancyByRevenue.series = [
        {
          name: 'Actual Revenue',
          type: 'area',
          data: sumData
        },
        {
          name: 'Potential Revenue',
          type: 'line',
          data: prData
        }
      ];
      this.occupancyByRevenue.xaxis = {
        categories: categoriesArr,
      };
    } else {
      this.occupancyByRevenue.series = this.totalOccupancyByRevenue.totalOccupanyByRevenue || [];
    }
  }

  bindCompanySizeGraph() {
    if (!this.biolabsCompanySize || !this.biolabsCompanySize.companySize || !this.biolabsCompanySize.companySize.length) {
      this.companySizeGraph.series = [];
      return;
    }
    let companySizeByDateCategories: any = [];
    let companySizeByDateData: any = [];
    let displayZero = false;
    const companySizeData: any = this.biolabsCompanySize.companySize;
    companySizeData.sort((fstVal: any, sndVal: any) => {
      const firstRange = fstVal.range.split('-');
      const secondRange = sndVal.range.split('-');
      if (firstRange[0].endsWith('+')) {
        // return firstRange;
        firstRange[0] = firstRange[0].split('+')[0];
      } else if (secondRange[0].endsWith('+')) {
        secondRange[0] = secondRange[0].split('+')[0];
      }
      if (Number(firstRange[0]) > Number(secondRange[0])) {
        return 1;
      }
      if (Number(firstRange[0]) < Number(secondRange[0])) {
        return -1;
      }
      return 0;
    });
    companySizeData.forEach((element: any) => {
      if ((element.count && element.count != 0) || displayZero) {
        displayZero = true;
        companySizeByDateCategories = companySizeByDateCategories.concat(element.range);
        companySizeByDateData = companySizeByDateData.concat(element.count);
      }
    });
    if (!companySizeByDateData.length) {
      this.companySizeGraph.series = [];
      return;
    }
    this.companySizeGraph.series = [
      {
        name: 'Company Count',
        type: 'column',
        data: companySizeByDateData
      }
    ];
    this.companySizeGraph.xaxis = {
      categories: companySizeByDateCategories,
      title: {
        text: 'Company Sizes',
        style: {
          fontWeight:  400
        },
      }
    };
  }
  bindNumberOfMembers() {
    if (!this.noOfMembersAndFundRaisedSum || !this.noOfMembersAndFundRaisedSum.noOfMembers
      || !this.noOfMembersAndFundRaisedSum.noOfMembers.length) {
      this.numberOfMembers.series = [];
      return;
    }
    let noOfMembersCategories: any = [];
    let noOfMembersData: any = [];
    this.noOfMembersAndFundRaisedSum.noOfMembers.forEach((element: any) => {
      if (element.qty || element.qty == 0) {
        noOfMembersCategories = noOfMembersCategories.concat(element.mon);
        noOfMembersData = noOfMembersData.concat(element.qty);
      }
    });
    const isAllZero = noOfMembersData.every((item: any) => item == 0);
    if (!noOfMembersData.length || isAllZero) {
      this.numberOfMembers.series = [];
      return;
    }
    this.numberOfMembers.series = [
      {
        name: 'Number of Members',
        type: 'line',
        data: noOfMembersData
      }
    ];
    this.numberOfMembers.xaxis = {
      categories: noOfMembersCategories
    };
  }

  bindSumOfFundRaised() {
    if (!this.noOfMembersAndFundRaisedSum || !this.noOfMembersAndFundRaisedSum.sumOfFundRaised
      || !this.noOfMembersAndFundRaisedSum.sumOfFundRaised.length) {
      this.sumOfFundRaised.series = [];
      return;
    }
    let sumOfFundRaisedCategories: any = [];
    let sumOfFundRaisedData: any = [];
    this.noOfMembersAndFundRaisedSum.sumOfFundRaised.forEach((element: any) => {
      if (element.tsum || element.tsum == 0) {
        sumOfFundRaisedCategories = sumOfFundRaisedCategories.concat(element.ud);
        sumOfFundRaisedData = sumOfFundRaisedData.concat(element.tsum);
      }
    });
    const isAllZero = sumOfFundRaisedData.every((item: any) => item == 0);
    if (!sumOfFundRaisedData.length || isAllZero) {
      this.sumOfFundRaised.series = [];
      return;
    }
    this.sumOfFundRaised.series = [
      {
        name: 'Sum of Fund Raised',
        type: 'line',
        color: '#00E396',
        data:  sumOfFundRaisedData
      }
    ];
    this.sumOfFundRaised.xaxis = {
      categories: sumOfFundRaisedCategories
    };
  }

  bindGraduateCompanies() {
    if (!this.currentandgraduatecompanies || !this.currentandgraduatecompanies.totalOfGraduateCompanies
      || !this.currentandgraduatecompanies.totalOfGraduateCompanies.length) {
      this.graduateCompanies.series = [];
      return;
    }
    let graduateCompaniesCategories: any = [];
    let graduateCompaniesData: any = [];
    this.currentandgraduatecompanies.totalOfGraduateCompanies.forEach((element: any) => {
      if (element.summation || element.summation == 0) {
        graduateCompaniesCategories = graduateCompaniesCategories.concat(element.year_month);
        graduateCompaniesData = graduateCompaniesData.concat(element.summation);
      }
    });
    const isAllZero = graduateCompaniesData.every((item: any) => item == 0);
    if (!graduateCompaniesData.length || isAllZero) {
      this.graduateCompanies.series = [];
      return;
    }
    this.graduateCompanies.series = [
      {
        name: 'Graduate Companies',
        type: 'line',
        data: graduateCompaniesData
      }
    ];
    this.graduateCompanies.xaxis = {
      categories: graduateCompaniesCategories
    };
  }

  bindCurrentCompanies() {
    if (!this.currentandgraduatecompanies || !this.currentandgraduatecompanies.totalOfCurrentCompanies
      || !this.currentandgraduatecompanies.totalOfCurrentCompanies.length) {
      this.currentCompanies.series = [];
      return;
    }
    let currentCompaniesCategories: any = [];
    let currentCompaniesData: any = [];
    this.currentandgraduatecompanies.totalOfCurrentCompanies.forEach((element: any) => {
      if (element.tcnt || element.tcnt == 0) {
        currentCompaniesCategories = currentCompaniesCategories.concat(element.ud);
        currentCompaniesData = currentCompaniesData.concat(element.tcnt);
      }
    });
    const isAllZero = currentCompaniesData.every((item: any) => item == 0);
    if (!currentCompaniesData.length || isAllZero) {
      this.currentCompanies.series = [];
      return;
    }
    this.currentCompanies.series = [
      {
        name: 'Current Companies',
        type: 'line',
        color: '#00E396',
        data: currentCompaniesData
      }
    ];
    this.currentCompanies.xaxis = {
      categories: currentCompaniesCategories
    };
  }

  async bindTotalRevenueByType() {
    let categoriesArr: any = [];
    this.totalRevenueByTypeChart.series = [];
    this.totalRevenueByTypeChart.xaxis.categoriesArr = [];
    const displayZero: any = {
    };
    if (this.totalRevenueByTypeRes && this.totalRevenueByTypeRes.totalrevenuebytype
      && this.totalRevenueByTypeRes.totalrevenuebytype.length) {
      const occupancyByrevenueByType = this.totalRevenueByTypeRes.totalrevenuebytype;
      const prdoductAndRevenueTypeData: any = {  };
      const allDataGroupedBySite = occupancyByrevenueByType.filter((item: any) => item.producttypeid == this.productTypeIdForRevenue);
      const allData = this.groupBy(allDataGroupedBySite, 'ssite');
      if (!allData || !Object.keys(allData).length) {
        this.totalRevenueByTypeChart.series = [];
        return;
      }
      for (const key in allData) {
        if (allData.hasOwnProperty(key)) {
          prdoductAndRevenueTypeData[key] = [];
          allData[key].map((item: any, index: any) => {
            if (!categoriesArr.includes(item.mon_yr)) {
              categoriesArr = categoriesArr.concat(item.mon_yr);
            }
            prdoductAndRevenueTypeData[key] = prdoductAndRevenueTypeData[key].concat(item.sm);
          });
          displayZero[key] = prdoductAndRevenueTypeData[key].every((item: any) => item == 0);
        }
      }
      if (displayZero && Object.keys(displayZero).length) {
      for (const key in displayZero) {
        if (!displayZero[key]) {
          const siteName = this.getSiteName(key);
          this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData[key].length ?
            this.totalRevenueByTypeChart.series.concat({
              name: siteName, type: 'line',
              data: prdoductAndRevenueTypeData[key]
            })
            : [];
        }
      }
    }
      this.totalRevenueByTypeChart.xaxis = {
        categories: categoriesArr,
      };
    } else {
      this.totalRevenueByTypeChart.series = this.totalRevenueByTypeRes.totalrevenuebytype || [];
    }
  }

  async bindPercentageOccupancyByType() {
    let categoriesArr: any = [];
    this.totalPercentageByTypeChart.series = [];
    this.totalPercentageByTypeChart.xaxis.categoriesArr = [];
    const displayZero: any = {
    };
    if (this.totalPercentByTypeRes && this.totalPercentByTypeRes.percentageoccupancybytype
      && this.totalPercentByTypeRes.percentageoccupancybytype.length) {
      const occupancyByrevenueByType = this.totalPercentByTypeRes.percentageoccupancybytype;
      const prdoductAndRevenueTypeData: any = {  };
      const allDataGroupedBySite = occupancyByrevenueByType.filter((item: any) => item.producttypeid == this.productTypeIdForPercent);
      const allData = this.groupBy(allDataGroupedBySite, 'ssite');
      if (!allData || !Object.keys(allData).length) {
        this.totalPercentageByTypeChart.series = [];
        return;
      }
      for (const key in allData) {
        if (allData.hasOwnProperty(key)) {
          prdoductAndRevenueTypeData[key] = [];
          allData[key].map((item: any, index: any) => {
            if (!categoriesArr.includes(item.mon_yr)) {
              categoriesArr = categoriesArr.concat(item.mon_yr);
            }
            prdoductAndRevenueTypeData[key] = prdoductAndRevenueTypeData[key].concat(item.prcnt);
          });
          displayZero[key] = prdoductAndRevenueTypeData[key].every((item: any) => item == 0);
        }
      }
      if (displayZero && Object.keys(displayZero).length) {
      for (const key in displayZero) {
        if (!displayZero[key]) {
          const siteName = this.getSiteName(key);
          this.totalPercentageByTypeChart.series = prdoductAndRevenueTypeData[key].length ?
            this.totalPercentageByTypeChart.series.concat({
              name: siteName, type: 'line',
              data: prdoductAndRevenueTypeData[key]
            })
            : [];
        }
      }
    }
      this.totalPercentageByTypeChart.xaxis = {
        categories: categoriesArr,
      };
    } else {
      this.totalPercentageByTypeChart.series = this.totalPercentByTypeRes.percentageoccupancybytype || [];
    }
  }

  async bindCompanyTypesData() {
    if (!this.companyTypesAndFundRaised || !this.companyTypesAndFundRaised.companyTypes
      || !this.companyTypesAndFundRaised.companyTypes.length) {
      this.companyTypes.series = [];
      return;
    }
    let companyTypesByDateCategories: any = [];
    let companyTypesByDateData: any = [];
    const indusrtyItems = await this.defaultDataService.getIndustry();
    this.companyTypesAndFundRaised.companyTypes.forEach((element: any) => {
      if (element.count || element.count == 0) {
        const parentName = indusrtyItems.find((item: any) => item.id == element.ppid);
        if (/[()]/.test(parentName.name)) {
          const splitStr = parentName.name.split('(');
          parentName.name = splitStr[0];
        }
        companyTypesByDateCategories = companyTypesByDateCategories.concat(parentName.name);
        companyTypesByDateData = companyTypesByDateData.concat(element.count);
      }
    });
    const isAllZero = companyTypesByDateData.every((item: any) => item == 0);
    if (!companyTypesByDateData.length || isAllZero) {
      this.companyTypes.series = [];
      return;
    }
    this.companyTypes.series = [
      {
        name: 'Company Count',
        type: 'column',
        data: companyTypesByDateData
      }
    ];
    this.companyTypes.xaxis = {
      categories: companyTypesByDateCategories
    };
  }

  async bindFundRaised() {
    if (!this.companyTypesAndFundRaised || !this.companyTypesAndFundRaised.fundingRaisedStage
      || !this.companyTypesAndFundRaised.fundingRaisedStage.length) {
      this.fundingRaised.series = [];
      return;
    }
    let fundingRaisedByDateCategories: any = [];
    let fundingRaisedByDateData: any = [];
    const funding = await this.defaultDataService.getFundingOptions();
    this.companyTypesAndFundRaised.fundingRaisedStage.forEach((element: any) => {
      if (element.cnt  || element.cnt == 0) {
        const fundName = funding.find((item: any) => item.id == element.maxf);
        if (/[()]/.test(fundName.name)) {
          const splitStr = fundName.name.split('(');
          fundName.name = splitStr[0];
        }
        fundingRaisedByDateCategories = fundingRaisedByDateCategories.concat(fundName.name);
        fundingRaisedByDateData = fundingRaisedByDateData.concat(element.cnt);
      }
    });
    const isAllZero = fundingRaisedByDateData.every((item: any) => item == 0);
    if (!fundingRaisedByDateData.length || isAllZero) {
      this.fundingRaised.series = [];
      return;
    }
    this.fundingRaised.series = [
      {
        name: 'Company Count',
        type: 'column',
        data: fundingRaisedByDateData
      }
    ];
    this.fundingRaised.xaxis = {
      categories: fundingRaisedByDateCategories
    };
  }

  groupBy(arr: any, property: any) {
    return arr.reduce((acc: any, cur: any) => {
      acc[cur[property]] = [...acc[cur[property]] || [], cur];
      return acc;
    }, {});
  }
  getSmallestIndex(obj: any) {
    const values: any = Object.values(obj);
    const sortedArr = values.sort();
    return sortedArr[0];
  }


  getSiteName(siteId: any){
    if (this.sitesList.length) {
      const siteDet = this.sitesList.find((site: any) => site.id == siteId);
      return siteDet.name;
    }
  }

  onRevenueProductChange(){
      this.bindTotalRevenueByType();
  }

  onPercentProductChange(){
    this.bindPercentageOccupancyByType();
}

  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }

  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
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

  formatParseDate(date: any) {
    const parserDate = date ? date.split('-') : null;
    if (parserDate && parserDate[2].length > 4 || parserDate && parserDate[2].length < 4){
      return false;
    }
    const parsedDate = (parserDate && parserDate.length === 3) ? parserDate[2] + '-' + (parserDate[1].length === 2 ? parserDate[1] : `0${parserDate[1]}`) + '-' +
      (parserDate[0].length === 2 ? parserDate[0] : `0${parserDate[0]}`) : null;
    return parsedDate;
  }
  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultDataService.dateWithoutTime(dt);
  }

  onDateChange(fieldName: any){
    const startDate = this.formatParseDate(this.biolabsMetricsDashboardForm.startDate);
    const endDate = this.formatParseDate(this.biolabsMetricsDashboardForm.endDate);
    if (!this.biolabsMetricsDashboardForm.startDate || !this.biolabsMetricsDashboardForm.endDate) {
      return;
    }
    const startD = this.biolabsMetricsDashboardForm.startDate.split('-');
    const endD = this.biolabsMetricsDashboardForm.endDate.split('-');
    if ((fieldName === 'startDate')
      && (new Date(startD[2] + '-' + startD[1] + '-' + startD[0]) >= new Date(endD[2] + '-' + endD[1] + '-' + endD[0]))) {
      this.isDateValid.startDate = false;
      return;
    }
    if ((fieldName === 'endDate')
      && (new Date(startD[2] + '-' + startD[1] + '-' + startD[0]) >= new Date(endD[2] + '-' + endD[1] + '-' + endD[0]))) {
      this.isDateValid.endDate = false;
      return;
    }
    this.isDateValid.startDate = true;
    this.isDateValid.endDate = true;
    this.getBusinessMetrics(startDate, endDate);
    this.getBiolabsMetrics(startDate, endDate);
  }

  print(){
    const originalTitle = document.title;
    document.title = 'BioLabs Metrics';
    window.print();
    document.title = originalTitle;
  }

  onSiteNameClicked(event: any){
    this.router.navigate(['/metrics/sitemetrics'], { queryParams: { site: event.id }} );
  }
}
