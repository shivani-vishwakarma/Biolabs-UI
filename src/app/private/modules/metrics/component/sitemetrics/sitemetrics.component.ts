import { DatePipe, getCurrencySymbol } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as ApexCharts from 'apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DefaultDataService, inputDollarMasking } from 'src/app/shared/service/default-data.service';
import { environment } from 'src/environments/environment';
import { MetricsService } from '../../services/metrics.service';

export type occupancyByRevenue = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: any | any[];
  dataLabels: ApexDataLabels | any;
  points: any;
  grid: ApexGrid | any;
  fill: any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  hideSeries: any;
  showSeries: any;
};
export type companySizeAtEndOfDateRange = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  points: any;
  plotOptions: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type companyTypesAtEndOfDateRange = {
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
export type occupancyByPercent = {
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
export type occupancyByRevenuetype = {
  series: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  grid: ApexGrid | any;
  plotOptions: any;
  yaxis: any | any[];
  points: any;
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

@Component({
  selector: 'app-sitemetrics',
  templateUrl: './sitemetrics.component.html',
  styleUrls: ['./sitemetrics.component.css']
})
export class SitemetricsComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart: ChartComponent | any;
  @ViewChild('percentTypeChart') percentTypeChart: ChartComponent | any;
  @Input() selectedSite: any;
  @Input() sites: any;
  public occupancyByRevenue: Partial<occupancyByRevenue>;
  public occupancyByPercent: Partial<occupancyByPercent>;
  public occupancyByRevenuetype: Partial<occupancyByRevenuetype> | any;
  public totalRevenueByTypeChart: Partial<totalRevenueByTypeChart> | any;
  public companySizeAtEndOfDateRange: Partial<companySizeAtEndOfDateRange> | any;
  public companyTypesAtEndOfDateRange: Partial<companyTypesAtEndOfDateRange> | any;
  public numberOfMembers: Partial<numberOfMembers> | any;
  public fundingRaised: Partial<fundingRaised> | any;
  public graduateCompanies: Partial<graduateCompanies> | any;
  public currentCompanies: Partial<currentCompanies> | any;
  public sumOfFundRaised: Partial<sumOfFundRaised> | any;
  metricsForm: any;
  addEquipmentForm: any;
  siteMetrics: any;
  occupancyByRevenueAndPercentage: any;
  occupancyByRevenueAndPercentagetype: any;
  numberOfMembersAndSumOfFundRaised: any;
  metricsSelectedSiteDetail: any;
  currentandgraduatecompanies: any;
  siteDemographics: any;
  companyTypesAndFundRaised: any;
  companySize: any;
  averageData: any;
  globalDateFormat: any = environment.globalDateFormat;
  selectedSiteDetail: any;
  productTypeData: any = { benches: 0, office: 0, workstations: 0, labs: 0 };
  categoriesArr: any = [];
  occupancyByRevenueData: any = [];
  minCalDate: any;
  isDateValid = { startDate: true, endDate: true };
  siteName: any;

  constructor(
    public datepipe: DatePipe,
    public defaultDataService: DefaultDataService,
    private metricsService: MetricsService,
    private localStorageService: LocalStorageService,
    private dateAdapter: NgbDateAdapter<any>,
    public route: ActivatedRoute,
    private ngbCalendar: NgbCalendar) {
    this.selectedSiteDetail = localStorageService.get('SELECTED_SITE_DETAIL');
    this.companySizeAtEndOfDateRange = {
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
            fontWeight: 400
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
            formatter: (val: any) => {
              return val.toFixed(0);
            }
          },
          title: {
            text: 'Company Count',
            style: {
              fontWeight: 400
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
        offsetX: 40
      }
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
              fontWeight: 400
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
    this.companyTypesAtEndOfDateRange = {
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
              fontWeight: 400
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
        curve: 'smooth',
        dashArray: [0, 2],
        width: [2, 2]
      },
      fill: {
        type: 'solid',
        opacity: [0.20, 1],
      },
      grid: {
        show: true,
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
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
              const currencySign = getCurrencySymbol(this.metricsSelectedSiteDetail.currencyCode, 'wide');
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
            }
          },
          title: {
            text: 'Revenue',
            style: {
              fontWeight: 400,
            },
          },
        }
      ]
    };
    this.occupancyByRevenuetype = {
      series: [
        // {name: 'Lab', data: [20, 20, 30, 45,55,58, 60,68,70]}
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: true
        },
        events: {
          legendClick: (chartContext: any, seriesIndex: any, config: any) => {
            const benchesIndex = this.chart.series.findIndex((item: any) => item.name === 'Benches');
            const workstationsIndex = this.chart.series.findIndex((item: any) => item.name === 'Workstations');
            const officesIndex = this.chart.series.findIndex((item: any) => item.name === 'Offices');
            const labsIndex = this.chart.series.findIndex((item: any) => item.name === 'Labs');
            if (seriesIndex == benchesIndex) {
              this.chart.toggleSeries('Benches');
              this.chart.toggleSeries('Total Benches');
            }
            if (seriesIndex == workstationsIndex) {
              this.chart.toggleSeries('Total Workstations');
              this.chart.toggleSeries('Workstations');
            }
            if (seriesIndex == officesIndex) {
              this.chart.toggleSeries('Total Offices');
              this.chart.toggleSeries('Offices');
            }
            if (seriesIndex == labsIndex) {
              this.chart.toggleSeries('Total Labs');
              this.chart.toggleSeries('Labs');
            }
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        dashArray: [0, 0, 0, 0, 4, 4, 4, 4],
        width: [2, 2, 2, 2, 2, 2, 2, 2]
      },
      grid: {
        show: true
      },
      xaxis: {
      },
      legend: {
        onItemClick: {
          toggleDataSeries: false
        },
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
              fontWeight: 400
            },
          }
        }
      ]
    };
    this.occupancyByPercent = {
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
              return value.toFixed(2) + '%';
            }
          },
          title: {
            text: 'Percent',
            style: {
              fontWeight: 400
            },
          },
        }
      ]
    };
    this.totalRevenueByTypeChart = {
      series: [
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        zoom: {
          enabled: true
        },
        events: {
          legendClick: (chartContext: any, seriesIndex: any, config: any) => {
            const benchesIndex = this.percentTypeChart.series.findIndex((item: any) => item.name === 'Benches');
            const workstationsIndex = this.percentTypeChart.series.findIndex((item: any) => item.name === 'Workstations');
            const officesIndex = this.percentTypeChart.series.findIndex((item: any) => item.name === 'Offices');
            const labsIndex = this.percentTypeChart.series.findIndex((item: any) => item.name === 'Labs');
            const allIndex = this.percentTypeChart.series.findIndex((item: any) => item.name === 'All');
            if (seriesIndex == benchesIndex) {
              this.percentTypeChart.toggleSeries('Benches');
              this.percentTypeChart.toggleSeries('Benches PR');
            }
            if (seriesIndex == workstationsIndex) {
              this.percentTypeChart.toggleSeries('Workstations PR');
              this.percentTypeChart.toggleSeries('Workstations');
            }
            if (seriesIndex == officesIndex) {
              this.percentTypeChart.toggleSeries('Offices PR');
              this.percentTypeChart.toggleSeries('Offices');
            }
            if (seriesIndex == labsIndex) {
              this.percentTypeChart.toggleSeries('Labs PR');
              this.percentTypeChart.toggleSeries('Labs');
            }
            if (seriesIndex == allIndex) {
              this.percentTypeChart.toggleSeries('Total PR');
              this.percentTypeChart.toggleSeries('All');
            }
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        dashArray: [0, 0, 0, 0, 0, 4, 4, 4, 4, 4],
        width: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
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
      legend: {
        onItemClick: {
          toggleDataSeries: false
        },
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
              const currencySign = getCurrencySymbol(this.metricsSelectedSiteDetail.currencyCode, 'wide');
              // if(value > 1000){
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
              // }
              // return  currencySign + value;
            }
          },
          title: {
            text: 'Total Revenue',
            style: {
              fontWeight: 400
            },
          }
        }
      ]
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
              fontWeight: 400
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
              fontWeight: 400
            },
          }
        }
      ]
    };

    this.sumOfFundRaised = {
      series: [
      ],
      colors: ['#00E396'],
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
              const currencySign = getCurrencySymbol(this.metricsSelectedSiteDetail.currencyCode, 'wide');
              return currencySign + Intl.NumberFormat().format((value / 1000000)) + 'M';
            }
          },
          title: {
            text: 'Fundraising',
            style: {
              fontWeight: 400
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
              fontWeight: 400
            },
          }
        }
      ]
    };

    this.metricsForm = {
      startDate: null,
      endDate: null,
      totalSiteSquarefeet: '',
      totalOfficeSquarefeet: null,
      totalLabSquarefeet: null,
      totalEquipmentValue: null
    };
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: any) => {
      this.metricsForm.endDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
      if (params && params.site) {
        const siteId = parseInt(params.site, 10);
        this.getSiteConfigData(siteId);
        this.sites = await this.defaultDataService.getSiteList();
        this.metricsSelectedSiteDetail = (this.sites && this.sites.length) ? this.sites.find((ele: any) => ele.id == siteId) : {};
      } else {
        const siteDet = this.localStorageService.get('SELECTED_SITE_DETAIL');
        const siteId = siteDet.id;
        this.getSiteConfigData(siteId);
        this.metricsSelectedSiteDetail = siteDet;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedSite.currentValue) {
      return;
    }
    this.metricsForm.endDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    if (typeof (changes.selectedSite.currentValue) === 'number' || typeof (changes.selectedSite.currentValue) === 'string') {
      const siteId = changes.selectedSite.currentValue;
      this.getSiteConfigData(siteId);
      this.metricsSelectedSiteDetail = (this.sites && this.sites.length) ? this.sites.find((ele: any) => ele.id == this.selectedSite) : {};
    } else if (typeof (changes.selectedSite.currentValue) === 'object' && Object.keys(changes.selectedSite.currentValue).length > 0) {
      const siteId = changes.selectedSite.currentValue.id;
      this.getSiteConfigData(siteId);
      this.metricsSelectedSiteDetail = (this.sites && this.sites.length) ? this.sites.find((ele: any) => ele.id == this.selectedSite) : {};
    }
  }

  getMetricsData(siteId: any, startDate: any, endDate: any) {
    this.getOccupancyByRevenueAndPercentage(siteId, startDate, endDate);
    this.getOccupancyByRevenueAndPercentagebytype(siteId, startDate, endDate);
    this.getSiteDemographics(siteId, startDate, endDate);
    this.getCompanySize(siteId, startDate, endDate);
    this.getCompanyTypes(siteId, startDate, endDate);
    this.getNumberOfMemberandSumOfFundRaised(siteId, startDate, endDate);
    this.getCurrentandgraduatecompanies(siteId, startDate, endDate);
    this.getAverageData(siteId, startDate, endDate);
  }

  getSiteConfigData(siteId: any) {
    this.metricsService.getSiteConfigData(siteId).subscribe(res => {
      if (!res || !res.data || !res.data.openDate) {
        this.restoreToDefault();
        return;
      }
      // const startDate = new Date().getFullYear() + '-' + '01' + '-' + '01';
      // this.metricsForm.startDate = '01' + '-' + '01' + '-' + new Date().getFullYear();
      const openDateWithouTime = this.defaultDataService.dateWithoutTime(res.data.openDate);
      const startDate = this.datepipe.transform(new Date(openDateWithouTime), 'yyyy-MM-dd');
      this.metricsForm.startDate = this.dateAdapter.toModel({
        day: Number(new Date(openDateWithouTime).getDate()),
        month: Number(new Date(openDateWithouTime).getMonth() + 1),
        year: Number(new Date(openDateWithouTime).getFullYear())
      });
      const endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      this.getMetricsData(siteId, startDate, endDate);
    });
  }

  restoreToDefault() {
    this.siteDemographics = {};
    // this.metricsForm.startDate = [];
    this.occupancyByRevenue.series = [];
    this.averageData = {};
    this.occupancyByPercent.series = [];
    this.occupancyByRevenuetype.series = [];
    this.totalRevenueByTypeChart.series = [];
    this.companySizeAtEndOfDateRange.series = [];
    this.companyTypesAtEndOfDateRange.series = [];
    this.numberOfMembers.series = [];
    this.fundingRaised.series = [];
    this.graduateCompanies.series = [];
    this.currentCompanies.series = [];
    this.sumOfFundRaised.series = [];
    this.productTypeData = { benches: 0, office: 0, workstations: 0, labs: 0 };
  }

  getSiteDemographics(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getSiteDemographics(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.siteDemographics = res;
      this.getProductTypeData();
    });
  }

  getAverageData(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getAverageData(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        this.averageData = null;
        return;
      }
      this.averageData = res;
    });
  }

  getOccupancyByRevenueAndPercentage(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getOccupanybyRevenueAndPercentage(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.occupancyByRevenueAndPercentage = res;
      this.getOccupancyByRevenue();
      this.getOccupancyByPercentage();
    });
  }

  getNumberOfMemberandSumOfFundRaised(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getNumberOfMemberandSumOfFundRaised(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.numberOfMembersAndSumOfFundRaised = res;
      this.getNumberOfMembers();
      this.getSumOfFundRaised();
    });
  }

  getCurrentandgraduatecompanies(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getCurrentandgraduatecompanies(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.currentandgraduatecompanies = res;
      this.getCurrentCompanies();
      this.getGraduateCompanies();
    });
  }

  getOccupancyByRevenueAndPercentagebytype(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getOccupanybyRevenueAndPercentagebytype(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.occupancyByRevenueAndPercentagetype = res;
      this.getOccupancyByRevenuetype();
      this.getOccupancyByPercentagetype();
    });
  }

  getCompanySize(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getCompanySize(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.companySize = res;
      this.getCompanySizeAtEndOfDateRange();
    });
  }

  getCompanyTypes(siteId: any, startDate: any, endDate: any) {
    this.metricsService.getCompanyTypes(siteId, startDate, endDate).subscribe(res => {
      if (!res) {
        return;
      }
      this.companyTypesAndFundRaised = res;
      this.getCompanyTypesData();
      this.getFundRaised();
    });
  }

  getCompanySizeAtEndOfDateRange() {
    if (!this.companySize || !this.companySize.companySize || !this.companySize.companySize.length) {
      this.companySizeAtEndOfDateRange.series = [];
      return;
    }
    let companySizeByDateCategories: any = [];
    let companySizeByDateData: any = [];
    const companySizeData: any = this.companySize.companySize;
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
      if (element.count || element.count == 0) {
        companySizeByDateCategories = companySizeByDateCategories.concat(element.range);
        companySizeByDateData = companySizeByDateData.concat(element.count);
      }
    });
    const isAllZero = companySizeByDateData.every((item: any) => item == 0);
    if (!companySizeByDateData.length || isAllZero) {
      this.companySizeAtEndOfDateRange.series = [];
      return;
    }
    this.companySizeAtEndOfDateRange.series = [
      {
        name: 'Company Count',
        type: 'column',
        data: companySizeByDateData
      }
    ];
    this.companySizeAtEndOfDateRange.xaxis = {
      categories: companySizeByDateCategories,
      title: {
        text: 'Company Sizes',
        style: {
          fontWeight: 400
        },
      }
    };
  }

  getNumberOfMembers() {
    if (!this.numberOfMembersAndSumOfFundRaised || !this.numberOfMembersAndSumOfFundRaised.noOfMembers
      || !this.numberOfMembersAndSumOfFundRaised.noOfMembers.length) {
      this.numberOfMembers.series = [];
      return;
    }
    let noOfMembersCategories: any = [];
    let noOfMembersData: any = [];
    this.numberOfMembersAndSumOfFundRaised.noOfMembers.forEach((element: any) => {
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

  getGraduateCompanies() {
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

  getSumOfFundRaised() {
    if (!this.numberOfMembersAndSumOfFundRaised || !this.numberOfMembersAndSumOfFundRaised.sumOfFundRaised
      || !this.numberOfMembersAndSumOfFundRaised.sumOfFundRaised.length) {
      this.sumOfFundRaised.series = [];
      return;
    }
    let sumOfFundRaisedCategories: any = [];
    let sumOfFundRaisedData: any = [];
    this.numberOfMembersAndSumOfFundRaised.sumOfFundRaised.forEach((element: any) => {
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
        data: sumOfFundRaisedData
      }
    ];
    this.sumOfFundRaised.xaxis = {
      categories: sumOfFundRaisedCategories
    };
  }

  getCurrentCompanies() {
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
        color: '#00E396',
        type: 'line',
        data: currentCompaniesData
      }
    ];
    this.currentCompanies.xaxis = {
      categories: currentCompaniesCategories
    };
  }

  async getCompanyTypesData() {
    if (!this.companyTypesAndFundRaised || !this.companyTypesAndFundRaised.companyTypes
      || !this.companyTypesAndFundRaised.companyTypes.length) {
      this.companyTypesAtEndOfDateRange.series = [];
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
      this.companyTypesAtEndOfDateRange.series = [];
      return;
    }
    this.companyTypesAtEndOfDateRange.series = [
      {
        name: 'Company Count',
        type: 'column',
        data: companyTypesByDateData
      }
    ];
    this.companyTypesAtEndOfDateRange.xaxis = {
      // labels:{
      //   show: true,
      //   trim: true
      // },
      categories: companyTypesByDateCategories
    };
  }

  async getFundRaised() {
    if (!this.companyTypesAndFundRaised || !this.companyTypesAndFundRaised.fundingRaised
      || !this.companyTypesAndFundRaised.fundingRaised.length) {
      this.fundingRaised.series = [];
      return;
    }
    let fundingRaisedByDateCategories: any = [];
    let fundingRaisedByDateData: any = [];
    const funding = await this.defaultDataService.getFundingOptions();
    this.companyTypesAndFundRaised.fundingRaised.forEach((element: any) => {
      if (element.cnt || element.cnt == 0) {
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

  getProductTypeData() {
    if (this.siteDemographics && this.siteDemographics.productTypeData && this.siteDemographics.productTypeData.length) {
      this.productTypeData = { benches: 0, office: 0, workstations: 0, labs: 0 };
      this.siteDemographics.productTypeData.forEach((element: any) => {
        if (element.productTypeId === 2) {
          this.productTypeData.benches = element.sum;
        }
        if (element.productTypeId === 3) {
          this.productTypeData.workstations = element.sum;
        }
        if (element.productTypeId === 4) {
          this.productTypeData.office = element.sum;
        }
        if (element.productTypeId === 5) {
          this.productTypeData.labs = element.sum;
        }
      });
    } else {
      this.productTypeData = { benches: 0, office: 0, workstations: 0, labs: 0 };
    }
  }

  getOccupancyByPercentage() {
    let revenueByPercentCategories: any = [];
    let revenueByPercentData: any = [];
    if (!this.occupancyByRevenueAndPercentage || !this.occupancyByRevenueAndPercentage.totalOccupanyByPercentage
      || !this.occupancyByRevenueAndPercentage.totalOccupanyByPercentage.length) {
      this.occupancyByPercent.series = [];
      return;
    }
    this.occupancyByRevenueAndPercentage.totalOccupanyByPercentage.forEach((element: any) => {
      if (element.prct || element.prct == 0) {
        revenueByPercentCategories = revenueByPercentCategories.concat(element.mon);
        revenueByPercentData = revenueByPercentData.concat(element.prct);
      }
    });
    const isAllZero = revenueByPercentData.every((item: any) => item == 0);
    if (!revenueByPercentData.length || isAllZero) {
      this.occupancyByPercent.series = [];
      return;
    }
    this.occupancyByPercent.series = [
      {
        name: 'Occupancy by Percent',
        type: 'line',
        data: revenueByPercentData
      }
    ];
    this.occupancyByPercent.xaxis = {
      categories: revenueByPercentCategories,
    };
  }

  getOccupancyByRevenue() {
    let categoriesArr: any = [];
    let sumData: any = [];
    let prData: any = [];
    this.occupancyByRevenue.series = [];
    if (this.occupancyByRevenueAndPercentage && this.occupancyByRevenueAndPercentage.totalOccupanyByRevenue
      && this.occupancyByRevenueAndPercentage.totalOccupanyByRevenue.length) {
      this.occupancyByRevenueAndPercentage.totalOccupanyByRevenue.forEach((element: any) => {
        if (element.sum || element.sum == 0 || element.pr || element.pr == 0) {
          categoriesArr = categoriesArr.concat(element.mon);
          if (element.sum || element.sum == 0) {
            sumData = sumData.concat(element.sum);
          }
          if (element.pr || element.pr == 0) {
            prData = prData.concat(element.pr);
          }
        }
      });
      const isAllSumZero = sumData.every((item: any) => item == 0);
      const isAllPrZero = prData.every((item: any) => item == 0);
      if (!sumData.length && !prData.length) {
        this.occupancyByRevenue.series = [];
        return;
      }
      if (!isAllSumZero && sumData.length) {
        this.occupancyByRevenue.series = this.occupancyByRevenue.series.concat({
          name: 'Actual Revenue',
          type: 'area',
          // color:'#c9e5f9',
          data: sumData
        });
        this.occupancyByRevenue.series = this.occupancyByRevenue.series.concat({
          name: 'Potential Revenue',
          type: 'line',
          data: prData
        });
      }
      // if(!isAllPrZero && prData.length){
      //   this.occupancyByRevenue.series = this.occupancyByRevenue.series.concat({
      //     name: 'Potential Revenue',
      //     data: prData
      //   })
      // }
      this.occupancyByRevenue.xaxis = {
        categories: categoriesArr,
      };
    } else {
      this.occupancyByRevenue.series = this.occupancyByRevenueAndPercentage.totalOccupanyByRevenue || [];
    }
  }

  getOccupancyByRevenuetype() {
    let categoriesArr: any = [];
    const displayZero = {
      labBenchFirstIndex: 0, workstationFirstIndex: 0, privateLabFirstIndex: 0,
      privateOfficeFirstIndex: 0, allFirstIndex: 0
    };
    if (this.occupancyByRevenueAndPercentagetype && this.occupancyByRevenueAndPercentagetype.occupancyByType
      && this.occupancyByRevenueAndPercentagetype.occupancyByType.length) {
      const occupancyByrevenueByType = this.occupancyByRevenueAndPercentagetype.occupancyByType;
      const prdoductAndRevenueTypeData: any = {
        labBenchData: [], workstationData: [], privateLabData: [], privateOfficeData: [], all: [],
        labBenchPrData: [], workstationPrData: [], privateLabPrData: [], privateOfficePrData: [], totalPrData: []
      };
      const allData = this.groupBy(occupancyByrevenueByType, 'productTypeId');
      if (allData && allData['2']) {
        allData['2'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.labBenchData = prdoductAndRevenueTypeData.labBenchData.concat(item.qty);
          prdoductAndRevenueTypeData.labBenchPrData = prdoductAndRevenueTypeData.labBenchPrData.concat(item.total);
        });
      }
      if (allData && allData['3']) {
        allData['3'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          // item.qty = '0';
          prdoductAndRevenueTypeData.workstationData = prdoductAndRevenueTypeData.workstationData.concat(item.qty);
          // item.total = null;
          prdoductAndRevenueTypeData.workstationPrData = prdoductAndRevenueTypeData.workstationPrData.concat(item.total);
        });
      }
      if (allData && allData['4']) {
        allData['4'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.privateOfficeData = prdoductAndRevenueTypeData.privateOfficeData.concat(item.qty);
          prdoductAndRevenueTypeData.privateOfficePrData = prdoductAndRevenueTypeData.privateOfficePrData.concat(item.total);
        });
      }
      if (allData && allData['5']) {
        allData['5'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.privateLabData = prdoductAndRevenueTypeData.privateLabData.concat(item.qty);
          prdoductAndRevenueTypeData.privateLabPrData = prdoductAndRevenueTypeData.privateLabPrData.concat(item.total);
        });
      }
      if (allData && allData['99']) {
        allData['99'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.all = prdoductAndRevenueTypeData.all.concat(item.qty);
        });
      }
      this.setOccupancyByRevenueData(prdoductAndRevenueTypeData);
      this.occupancyByRevenuetype.xaxis = {
        categories: categoriesArr,
      };
    } else {
      this.occupancyByRevenuetype.series = this.occupancyByRevenueAndPercentagetype.occupancyByType || [];
    }
  }

  setOccupancyByRevenueData(
    prdoductAndRevenueTypeData: any,
  ) {
    this.occupancyByRevenuetype.series = [];
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.labBenchData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Benches', type: 'line',
        data: prdoductAndRevenueTypeData.labBenchData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.workstationData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Workstations', type: 'line',
        data: prdoductAndRevenueTypeData.workstationData
      })
      : this.occupancyByRevenuetype.series;
    // }
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.privateOfficeData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Offices', type: 'line',
        data: prdoductAndRevenueTypeData.privateOfficeData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.privateLabData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Labs', type: 'line',
        data: prdoductAndRevenueTypeData.privateLabData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.labBenchPrData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Total Benches', type: 'line', color: '#008ffb',
        data: prdoductAndRevenueTypeData.labBenchPrData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.workstationPrData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Total Workstations', type: 'line', color: '#00e396',
        data: prdoductAndRevenueTypeData.workstationPrData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.privateOfficePrData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Total Offices', type: 'line', color: '#feb019',
        data: prdoductAndRevenueTypeData.privateOfficePrData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.privateLabPrData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Total Labs', type: 'line', color: '#ff4560',
        data: prdoductAndRevenueTypeData.privateLabPrData
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.all.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'All', type: 'line', color: '#008ffb',
        data: prdoductAndRevenueTypeData.all
      })
      : this.occupancyByRevenuetype.series;
    this.occupancyByRevenuetype.series = prdoductAndRevenueTypeData.totalPrData.length ?
      this.occupancyByRevenuetype.series.concat({
        name: 'Total PR', type: 'line', color: '#008ffb',
        data: prdoductAndRevenueTypeData.totalPrData
      })
      : this.occupancyByRevenuetype.series;
  }

  setTotalRevenueByTypeData(
    prdoductAndRevenueTypeData: any,
  ) {
    this.totalRevenueByTypeChart.series = [];
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.labBenchData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Benches', type: 'line',
        data: prdoductAndRevenueTypeData.labBenchData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.workstationData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Workstations', type: 'line',
        data: prdoductAndRevenueTypeData.workstationData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.privateOfficeData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Offices', type: 'line',
        data: prdoductAndRevenueTypeData.privateOfficeData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.privateLabData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Labs', type: 'line',
        data: prdoductAndRevenueTypeData.privateLabData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.all.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'All', type: 'line', color: 'purple',
        data: prdoductAndRevenueTypeData.all
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.labBenchPrData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Benches PR', type: 'line', color: '#008ffb',
        data: prdoductAndRevenueTypeData.labBenchPrData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.workstationPrData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Workstations PR', type: 'line', color: '#00e396',
        data: prdoductAndRevenueTypeData.workstationPrData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.privateOfficePrData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Offices PR', type: 'line', color: '#feb019',
        data: prdoductAndRevenueTypeData.privateOfficePrData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.privateLabPrData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Labs PR', type: 'line', color: '#ff4560',
        data: prdoductAndRevenueTypeData.privateLabPrData
      })
      : this.totalRevenueByTypeChart.series;
    this.totalRevenueByTypeChart.series = prdoductAndRevenueTypeData.totalPrData.length ?
      this.totalRevenueByTypeChart.series.concat({
        name: 'Total PR', type: 'line', color: 'purple',
        data: prdoductAndRevenueTypeData.totalPrData
      })
      : this.totalRevenueByTypeChart.series;
  }

  getOccupancyByPercentagetype() {
    let categoriesArr: any = [];
    const displayZeroIndex = {
      labBenchFirstIndex: 0, workstationFirstIndex: 0, privateLabFirstIndex: 0,
      privateOfficeFirstIndex: 0, allFirstIndex: 0
    };
    if (this.occupancyByRevenueAndPercentagetype && this.occupancyByRevenueAndPercentagetype.totalRevenueByType
      && this.occupancyByRevenueAndPercentagetype.totalRevenueByType.length) {
      const occupancyBypercentByType = this.occupancyByRevenueAndPercentagetype.totalRevenueByType;
      const prdoductAndRevenueTypeData: any = { labBenchData: [], workstationData: [], privateLabData: [], privateOfficeData: [], all: [],
        labBenchPrData: [], workstationPrData: [], privateLabPrData: [], privateOfficePrData: [], totalPrData: [] };
      const allData = this.groupBy(occupancyBypercentByType, 'productTypeId');
      if (allData && allData['2']) {
        allData['2'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.labBenchData = prdoductAndRevenueTypeData.labBenchData.concat(item.summation);
          prdoductAndRevenueTypeData.labBenchPrData = prdoductAndRevenueTypeData.labBenchPrData.concat(item.pr);
        });
      }
      if (allData && allData['3']) {
        allData['3'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.workstationData = prdoductAndRevenueTypeData.workstationData.concat(item.summation);
          prdoductAndRevenueTypeData.workstationPrData = prdoductAndRevenueTypeData.workstationPrData.concat(item.pr);
        });
      }
      if (allData && allData['4']) {
        allData['4'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.privateOfficeData = prdoductAndRevenueTypeData.privateOfficeData.concat(item.summation);
          prdoductAndRevenueTypeData.privateOfficePrData = prdoductAndRevenueTypeData.privateOfficePrData.concat(item.pr);
        });
      }
      if (allData && allData['5']) {
        allData['5'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.privateLabData = prdoductAndRevenueTypeData.privateLabData.concat(item.summation);
          prdoductAndRevenueTypeData.privateLabPrData = prdoductAndRevenueTypeData.privateLabPrData.concat(item.pr);
        });
      }
      if (allData && allData['99']) {
        allData['99'].map((item: any, index: any) => {
          if (!categoriesArr.includes(item.mon)) {
            categoriesArr = categoriesArr.concat(item.mon);
          }
          prdoductAndRevenueTypeData.all = prdoductAndRevenueTypeData.all.concat(item.summation);
          prdoductAndRevenueTypeData.totalPrData = prdoductAndRevenueTypeData.totalPrData.concat(item.pr);
        });
      }
      // const isAllLabBenchZero = prdoductAndRevenueTypeData.labBenchData.every((item: any) => item == 0);
      // const isAllWorkstationZero = prdoductAndRevenueTypeData.workstationData.every((item: any) => item == 0);
      // const isAllPrivateLabZero = prdoductAndRevenueTypeData.privateLabData.every((item: any) => item == 0);
      // const isAllPrivateOfficeZero = prdoductAndRevenueTypeData.privateOfficeData.every((item: any) => item == 0);
      // const isAllZero = prdoductAndRevenueTypeData.all.every((item: any) => item == 0);
      // const isAllLabBenchPrZero = prdoductAndRevenueTypeData.labBenchPrData.every((item: any) => item == 0);
      // const isAllWorkstationPrZero = prdoductAndRevenueTypeData.workstationPrData.every((item: any) => item == 0);
      // const isAllPrivateLabPrZero = prdoductAndRevenueTypeData.privateLabPrData.every((item: any) => item == 0);
      // const isAllPrivateOfficePrZero = prdoductAndRevenueTypeData.privateOfficePrData.every((item: any) => item == 0);
      // const isAllTotalPrZero = prdoductAndRevenueTypeData.totalPrData.every((item: any) => item == 0);
      // this.setTotalRevenueByTypeData(prdoductAndRevenueTypeData, isAllLabBenchZero, isAllWorkstationZero,
      //   isAllPrivateLabZero, isAllPrivateOfficeZero, isAllZero, isAllLabBenchPrZero, isAllWorkstationPrZero,
      //   isAllPrivateLabPrZero, isAllPrivateOfficePrZero, isAllTotalPrZero);
      this.setTotalRevenueByTypeData(prdoductAndRevenueTypeData);
      this.totalRevenueByTypeChart.xaxis = {
        categories: categoriesArr
      };
    } else {
      this.totalRevenueByTypeChart.series = this.occupancyByRevenueAndPercentagetype.totalOccupanyByRevenue || [];
    }
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

  // onChange(){
  //   this.onDateChange();
  //   this.restoreToDefault();
  // }

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
  onDateChange(fieldName?: any) {
    if (!this.metricsForm.startDate || !this.metricsForm.endDate) {
      return;
    }
    const startDate = this.formatParseDate(this.metricsForm.startDate);
    const endDate = this.formatParseDate(this.metricsForm.endDate);
    const startD = this.metricsForm.startDate.split('-');
    const endD = this.metricsForm.endDate.split('-');
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
    const siteId = this.metricsSelectedSiteDetail.id;
    this.getMetricsData(siteId, startDate, endDate);
    this.restoreToDefault();
  }

  export() {
  }

  print() {
    const originalTitle = document.title;
    const siteName = this.metricsSelectedSiteDetail.name;
    document.title = `${siteName} Metrics`;
    window.print();
    document.title = originalTitle;
  }
}
