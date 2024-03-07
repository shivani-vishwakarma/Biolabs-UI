import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { environment } from 'src/environments/environment';

import { PrivacyService } from 'src/app/core/services/privacy.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis
} from 'ng-apexcharts';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { API_URL } from 'src/app/core/constants/api-url';
import { HttpService } from 'src/app/core/rest/http.service';
import { GrowthService } from 'src/app/core/services/growth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GLOBAL } from 'src/app/shared/utility/config.service';

export type stateTech = {
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
export type fund = {
  series: any;
  colors: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};
export type other = {
  series: any;
  colors: any;
  chart: any;
  xaxis: any;
  markers: any;
  stroke: any;
  yaxis: any | any[];
  dataLabels: any;
  title: any;
  legend: any;
  fill: any;
  tooltip: any;
};


@Component({
  selector: 'app-growth',
  templateUrl: './growth.component.html',
  styleUrls: ['./growth.component.css']
})
export class GrowthComponent implements OnInit {
  company: any;
  fundingSourceName: string[] = [];
  dateWithBiolab: any;
  userFee: any;
  labBenchFee: any;
  privateLabFee: any;
  globalDateFormat = environment.globalDateFormat;
  benchGraphData: any = [];
  officeGraphData: any = [];
  data: any;
  privacyData: any = {
    'Patents filed & granted changed ' : 'patentsFiledAndGranted',
    'Clinical Trial Information ' : 'clinicalTrialInformation',
    'Funding Source changed ' : 'fundingSource',
    'Funding changed ' : 'fundingAmount',
    'Company size changed ' : 'companySize',
    'Recognized partnerships with academia changed ' : 'partnershipWithAcademia',
    'Recognized partnerships with industry changed ' : 'partnershipsWithIndustry',
    'Description for recognized partnerships with academia changed ' : 'partnershipWithAcademia',
    'Description for recognized partnerships with industry changed ' : 'partnershipsWithIndustry',
    'Patents Filed changed ': 'patentsFiledAndGranted',
    'Patents Granted changed ': 'patentsFiledAndGranted',
    'Active Clinical Trials changed ': 'clinicalTrialInformation',
    'Clinical Trial Participants changed ' : 'clinicalTrialInformation'
    };

  @ViewChild('chart') chart: ChartComponent | undefined;
  public stateTech: Partial<stateTech>;
  public fund: Partial<fund>;
  public other: Partial<other>;
  selectedSite: any;
  xAxis: string[] = [];

  /** BIOL-58 */
  technologyStageOptions: any[] = [];
  blankObjForTechnologyStage: any = {
    id: 0,
    name: ''
  };
  stageGraph = false;
  fundGraph = false;
  stageGraphLoader = false;
  fundGraphLoader = false;
  feeds: any;
  analysisGraph = false;
  analysisGraphLoader = false;
  selectedSiteDetail: any;
  longFeedsAttributes: any = ['R&D path & commercialization', 'Technology Summary', 'Elevator Pitch'];

  constructor(
    private growthService: GrowthService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private localStorage: LocalStorageService,
    public defaultData: DefaultDataService,
    private router: Router,
    public privacyService: PrivacyService
  ) {

    this.stateTech = {
      series: [
        {
          name: 'Stage of Technology',
          type: 'column',
          data: [3, 2, 6, 4, 3, 4, 5, 7]
        }
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
      title: {
        text: 'Stage of Technology',
        align: 'left',
        offsetX: 110
      },
      xaxis:
      {
        categories: ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020', 'Q1 2021', 'Q2 2021', 'Q3 2022', 'Q4 2021'],
      },
      yaxis: [
        {
          forceNiceScale: false,
          tickAmount: 12,
          decimalsInFloat: undefined,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            show: true,
            align: 'right',
            minWidth: 100,
            style: {
              colors: [],
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            rotate: -40,
            formatter: (i: number) => {
              if (this.technologyStageOptions.length >= 12 && Number.isInteger(i)) {
                if (i >= 0 && i <= 11) {
                  return this.technologyStageOptions[i].name;
                } else {
                  return this.technologyStageOptions[this.technologyStageOptions.length - 1].name;
                }
              }
            }
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
    this.fund = {
      series: [
        {
          name: 'Funding Amount',
          type: 'line',
          data: [2000, 3000, 2500, 2900, 3700, 4500, 5000, 4390]
        }
      ],
      colors: ['#00E396'],
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        type: 'area',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [2]
      },
      title: {
        text: 'Funding Amount',
        align: 'left',
        offsetX: 110
      },
      xaxis:
      {
        categories: ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020', 'Q1 2021', 'Q2 2021', 'Q3 2022', 'Q4 2021'],
        // title: {
        //   text: 'Quarter Month'
        // }
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            style: {
            }
          },
        },
        // {
        //   seriesName: "Funding Amount",
        //   opposite: true,
        //   axisTicks: {
        //     show: true
        //   },
        //   axisBorder: {
        //     show: true,
        //     color: "#00E396"
        //   },
        //   labels: {
        //     style: {
        //     }
        //   },
        //   // title: {
        //   //   text: "Funding Amount",
        //   //   style: {
        //   //     color: "#00E396"
        //   //   }
        //   // }
        // }
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
    this.other = {
      series: [
        {
          name: 'Employees',
          type: 'line',
          data: [2, 4, 5, 9, 7, 12, 15, 18]
        },
        {
          name: 'Offices',
          type: 'line',
          data: [2, 5, 8, 12, 14, 7, 8, 10]
        },
        {
          name: 'Rented Benches',
          type: 'line',
          data: [3, 2, 6, 4, 3, 4, 5, 7]
        }
      ],
      chart: {
        toolbar: {
          show: false
        },
        height: 430,
        type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 2, 2]
      },
      title: {
        text: 'Growth at BioLabs',
        align: 'left',
        offsetX: 110
      },
      xaxis:
      {
        categories: ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020', 'Q1 2021', 'Q2 2021', 'Q3 2022', 'Q4 2021'],
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            formatter: (val: any) => {
              return val.toFixed(0);
            },
            style: {
            }
          },
          title: {
            text: 'Count',
            style: {
              fontWeight: 400
            },
          },
          tooltip: {
            enabled: true
          }
        },
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
    this.viewPrivacydataforSponsor();
    if (this.activatedRoute.parent) {
      this.activatedRoute.parent.params.subscribe(params => {
        /** Get technology stages */
        this.getCompanyStage();
        this.getCompanyById(params.id);
      });
    }

    for (let i = 0; i < 4; i++) {
      const date: Date = new Date(new Date().setMonth(new Date().getMonth() - i * 3));
      this.xAxis.push(this.findQ(date));
    }
    this.selectedSiteDetail = this.localStorage.get('SELECTED_SITE_DETAIL');
  }

  /**
   * @description : Gives company application by application id
   * Description : Gives company application by application id
   * @param applicationId application Id
   */
  getCompanyById(applicationId: number) {
    this.spinner.show();
    this.growthService.getCompanyById(applicationId).subscribe((resp) => {
      // this.spinner.hide();
      this.company = resp;
      this.company.startDate = resp.startDate ? this.defaultData.dateWithoutTime(new Date(resp.startDate * 1000)) : '';
      this.getSelectedSiteId();
      this.getFundingName(resp.fundingSources, resp.otherFundingSource);
    }, (err) => {
      this.spinner.hide();
      if (err.statusCode == 406) {
        this.router.navigate(['/error'], { queryParams: {} });
      }
    });
  }

  /**
   * @description Gives the name of Funding Options
   * Description Gives the name of Funding Options
   * @param fundings fundings Ids
   * @param otherFunding Other fundings
   */
  getFundingName(fundings: any, otherFunding: string) {
    this.fundingSourceName = [];
    for (const name of fundings) {
      if (name && name.name && (name.id < 9999 || !otherFunding)) {
        this.fundingSourceName.push(name.name);
      } else {
        this.fundingSourceName.push(name.name + ' (' + otherFunding + ')');
      }
    }
  }

  /**
   * @description Gives Stage Of Technology  Site Id.
   * Description Gives Stage Of Technology  Site Id.
   * @param siteId Site Id.
   */
  stageOfTechnology(selectedSite: number, companyId: number) {
    this.stageGraphLoader = true;
    const stagesOfTechnology = 'stagesOfTechnology';
    const yearFormatKey = 'yyyy';
    this.growthService.stageOfTechnology(selectedSite, companyId).subscribe(res => {
      res = {
        stagesOfTechnology: this.ignoreFutureData(res[stagesOfTechnology], yearFormatKey)
      };
      this.stageGraphLoader = false;
      this.stageGraph = res && res.stagesOfTechnology.length ? true : false;
      const quarterNo = [];
      const categoriesArr = [];
      if (res.stagesOfTechnology.length <= 4) {
        for (let index = this.xAxis.length - 1; index >= 0; index--) {
          const element = this.xAxis[index];
          const data = res.stagesOfTechnology.find((sot: any) => sot.quat == element);
          if (data) {
            const eleIndex = this.technologyStageOptions.findIndex(item => item.id == data.stage);
            quarterNo.push(eleIndex);
            categoriesArr.push(data.quat);
          } else {
            ((res[index + 1]) && res[index + 1][data.stage])
              ? quarterNo.push(res[index + 1][data.stage])
              : quarterNo.push(0);
            // quarterNo.push(0);
            categoriesArr.push(element);
          }
        }
      }
      else {
        for (let index = 0; index < res.stagesOfTechnology.length; index++) {
          const element = res.stagesOfTechnology[index];
          if (element) {
            const eleIndex = this.technologyStageOptions.findIndex(item => item.id == element.stage);
            quarterNo.push(eleIndex);
            categoriesArr.push(element.quat);
          }
          else {
            ((res[index + 1]) && res[index + 1][element.stage])
              ? quarterNo.push(res[index + 1][element.stage])
              : quarterNo.push(0);
            categoriesArr.push(element);
          }
        }
      }
      const quartersData: any = quarterNo;
      if (Math.max(...quartersData) > 12) {
        quartersData.remove(Math.max(...quartersData));
      }
      this.stateTech.yaxis[0].tickAmount = Math.max(...quartersData) + 1;
      this.stateTech.series = [
        {
          name: 'Stage of Technology',
          type: 'column',
          data: quarterNo
        }
      ];
      this.stateTech.xaxis = {
        categories: categoriesArr,
      };
    }, err => {
      this.stageGraph = false;
      this.stageGraphLoader = false;
      console.log(err);
    });
  }

  findQ(date: Date) {
    const month = date.getMonth() + 1;
    let q = '';
    if (month < 4) {
      q = 'Q1';
    } else if (month < 7) {
      q = 'Q2';
    } else if (month < 10) {
      q = 'Q3';
    } else {
      q = 'Q4';
    }
    return q + '.' + date.getFullYear();
  }

  /**
   * @description Gives Funding of Application by  Site Id and Company Id.
   * Description Gives Funding of Application by  Site Id and Company Id.
   * @param companyId Company Id.
   * @param siteId SiteId.
   */
  funding(selectedSite: number, companyId: number) {
    this.fundGraphLoader = true;
    const fundings = 'fundings';
    const yearFormatKey = 'yyyy';
    this.growthService.funding(selectedSite, companyId).subscribe(res => {
      res = {
        fundings: this.ignoreFutureData(res[fundings], yearFormatKey)
      };
      this.fundGraphLoader = false;
      this.fundGraph = res && res.fundings.length ? true : false;
      const quarterNo = [];
      const categoriesArr = [];
      if (res.fundings.length <= 4) {
        for (let index = this.xAxis.length - 1; index >= 0; index--) {
          const element = this.xAxis[index];
          const data = res.fundings.find((funding: any) => funding.quatertext == element);
          if (data) {
            quarterNo.push(data.funding);
            categoriesArr.push(data.quatertext);
          } else {
            ((res[index + 1]) && res[index + 1][data.funding])
              ? quarterNo.push(res[index + 1][data.funding])
              : quarterNo.push(0);
            categoriesArr.push(element);
            // quarterNo.push(0);
          }
        }
      } else {
        for (let index = 0; index < res.fundings.length; index++) {
          const data = res.fundings[index];
          if (data) {
            quarterNo.push(data.funding);
            categoriesArr.push(data.quatertext);
          } else {
            ((res[index + 1]) && res[index + 1][data.funding])
              ? quarterNo.push(res[index + 1][data.funding])
              : quarterNo.push(0);
            categoriesArr.push(data);
            // quarterNo.push(0);
          }
        }
      }
      this.fund.series = [
        {
          name: 'Funding Amount',
          type: 'column',
          data: quarterNo
        }
      ];
      this.fund.xaxis = {
        categories: categoriesArr,
      };
    }, err => {
      this.fundGraph = false;
      this.fundGraphLoader = false;
      console.log(err);
    });
  }

  /**
   * @description Gives Selected Site By Id.
   * Description Gives Selected Site By Id.
   */
  getSelectedSiteId() {
    const site = this.localStorage.get('SELECTED_SITE');
    this.selectedSite = site;
    if (site && typeof site == 'string' && site != '{}') {
      this.selectedSite = this.localStorage.get('SELECTED_SITE');
    } else if (site && typeof site == 'object' && Object.keys(site).length > 0) {
      this.selectedSite = this.localStorage.get('SELECTED_SITE');
    }
    this.spinner.hide();
    // const siteId = this.company.site.length ? this.company.site[0] : this.selectedSite;
    this.stageOfTechnology(this.company.site[0], this.company.id);
    this.funding(this.company.site[0], this.company.id);
    this.getStartedWithBiolabs(this.company.site[0], this.company.id);
    this.getFinancialFees(this.company.id);
    this.getFeeds(this.company.site[0], this.company.id);
    this.getTimelineAnalysis(this.company.id);
    // this.getCompanySizeAnalysis(this.company.id);
  }

  /**
   * @description Get master technology stage array
   * @returns array of technology stages
   */
  async getCompanyStage() {
    this.technologyStageOptions = await this.defaultData.getCompanyStage();
    /** Insert blank object in technology array at 0th position */
    this.technologyStageOptions.splice(0, 0, this.blankObjForTechnologyStage);
    return this.technologyStageOptions;
  }

  /**
   * @description Get started with biolabs(get date with BioLabs).
   * Description Get started with  biolabs(get date with BioLabs).
   * @param siteId Site Id
   * @param companyId Company Id
   */
  getStartedWithBiolabs(siteId: number, companyId: number) {
    this.growthService.getStartedWithBiolabs(siteId, companyId).subscribe((resp) => {
      this.dateWithBiolab = resp[0].startwithbiolabs;
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * @description Get started with biolabs(get date with BioLabs).
   * Description Get started with  biolabs(get date with BioLabs).
   * @param siteId Site Id
   * @param companyId Company Id
   */
  getFeeds(siteId: number, companyId: number) {
    this.growthService.getFeeds(siteId, companyId).subscribe((resp) => {
      this.feeds = resp;
    }, (err) => {
      console.log(err);
    });
  }
  /**
   * @description Get current month fee details.
   * Description Get current month fee details.
   * @param siteId Site Id
   * @param companyId Company Id
   */
  getFinancialFees(companyId: number) {
    this.growthService.getFinancialFees(companyId).subscribe((resp) => {
      resp.map((o: any) => {
        if (o.productTypeId == 1) {
          this.userFee = o.sum;
        } else if (o.productTypeId == 2) {
          this.labBenchFee = o.sum;
        } else if (o.productTypeId == 5) {
          this.privateLabFee = o.sum;
        }
      });
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * @description Gets data to visualize timeline data(Employees Data, Offices Data, Rented Benches Data) on graph on bases of company ID.
   * Description Gets data to visualize timeline data(Employees Data, Offices Data, Rented Benches Data) on graph bases of company ID.
   * @param companyId Company Id
   */
  getTimelineAnalysis(companyId: number) {
    const officesData: any = [];
    const benchesData: any = [];
    const benchesQuat: any = [];
    const officesQuat: any = [];
    const noofemployeesY: any = [];
    const noofemployeesX: any = [];
    const companySizeDataArray: any = [];
    this.analysisGraphLoader = true;
    this.growthService.getTimelineAnalysis(companyId).subscribe((resp) => {
      resp = this.ignoreFutureData(resp, 'year');
      this.analysisGraphLoader = false;
      this.analysisGraph = resp && resp.length ? true : false;
      const benchesDataArray: any = [];
      const officesDataArray: any = [];
      resp.map((item: any) => {
        if (item.productTypeId == 2) {
          benchesDataArray.push(item);
        }
        if (item.productTypeId == 4) {
          officesDataArray.push(item);
        }
      });

      if (benchesDataArray.length >= 4 && officesDataArray.length >= 4) {
        const currentyear = new Date().getFullYear();
        for (let index = 0; index < resp.length; index++) {
          this.setProductsByTypeId(resp, index, currentyear, benchesQuat, benchesData, officesQuat, officesData);
        }
      }

      if (benchesDataArray.length < 4 || officesDataArray.length < 4) {
        for (let index = this.xAxis.length - 1; index >= 0; index--) {
          const element = this.xAxis[index];
          const data1 = benchesDataArray.find((sot: any) => sot.quat == element);
          const data2 = officesDataArray.find((sot: any) => sot.quat == element);
          this.formatDataByQuarters(data1, benchesData, benchesQuat, index, benchesDataArray, element, 'benches');
          this.formatDataByQuarters(data2, officesData, officesQuat, index, officesDataArray, element, 'offices');
        }
      }
      this.growthService.getCompanySizeAnalysis(companyId).subscribe((response) => {
        const officeDataArr: any = [];
        const benchDataArr: any = [];
        const quatKey = 'quat';
        response = this.ignoreFutureData(response, 'year');
        const noofemployeeskey = 'noofemployees';
        const timelineXaxis: any = [];
        for (let index = this.xAxis.length - 1; index >= 0; index--) {
          const element = this.xAxis[index];
          timelineXaxis.push(element);
          const data = response.find((sot: any) => sot.quat == element);
          if (data) {
            companySizeDataArray.push(data.noofemployees);
          } else {
            ((response[index + 1]) && response[index + 1][noofemployeeskey])
              ? companySizeDataArray.push(response[index + 1][noofemployeeskey])
              : companySizeDataArray.push(0);
          }

        }

        if (response.length >= 4) {
          for (const item of response) {
            noofemployeesY.push(item[noofemployeeskey]);
            noofemployeesX.push(item[quatKey]);
            const bench = this.benchGraphData.find((benchesItem: any) => benchesItem.quat === item[quatKey]);
            if (bench) {
              benchDataArr.push(bench.value);
            } else {
              benchDataArr.push(0);
            }

            const office = this.officeGraphData.find((officeItem: any) => officeItem.quat === item[quatKey]);
            if (office) {
              officeDataArr.push(office.value);
            } else {
              officeDataArr.push(0);
            }
          }
          this.initializeOverallAnalysisGraph(noofemployeesY, officeDataArr, benchDataArr, noofemployeesX);
        } else {
          this.initializeOverallAnalysisGraph(companySizeDataArray, benchesData, officesData, timelineXaxis);
        }
      }, err => {
        console.log(err);
      });
    }, (err) => {
      this.analysisGraphLoader = false;
      this.analysisGraph = false;
      console.log(err);
    });


  }


  private setProductsByTypeId(
    resp: any, index: number, currentyear: number, benchesQuat: any, benchesData: any, officesQuat: any, officesData: any
    ) {
    const productTypeIdKey = 'productTypeId';
    const yearKey = 'year';
    const quat = 'quat';
    const sumofquantity = 'sumofquantity';

    if (resp[index][productTypeIdKey] == 2 && resp[index][yearKey] <= currentyear) {
      benchesQuat.push(resp[index][quat]);
      benchesData.push(resp[index][sumofquantity]);
      this.benchGraphData.push({ quat: resp[index][quat], value: resp[index][sumofquantity] });

    }
    if (resp[index][productTypeIdKey] == 4 && resp[index][yearKey] <= currentyear) {
      officesQuat.push(resp[index][quat]);
      officesData.push(resp[index][sumofquantity]);

      this.officeGraphData.push({ quat: resp[index][quat], value: resp[index][sumofquantity] });
    }
  }

  /**
   * @description Initialize Data To Overall Analysis Graph Data(on dom).
   * Description Initialize Data To Overall Analysis Graph Data(on dom).
   * @param companySizeDataArray Size of Company.
   * @param officesData Office Data.
   * @param benchesData Benches Data.
   * @param benchesQuat Bencher Quarter.
   */
  private initializeOverallAnalysisGraph(companySizeDataArray: any, officesData: any, benchesData: any, empQuat: any) {
    this.other.series = [
      {
        name: 'Employees',
        type: 'line',
        data: companySizeDataArray
      },
      {
        name: 'Offices',
        type: 'line',
        data: officesData
      },
      {
        name: 'Rented Benches',
        type: 'line',
        data: benchesData
      }
    ];
    if ( !this.checkFeedsPermission('Company size changed ')){
      this.other.series.splice(0, 1);
      empQuat.splice(0, 1);
    }
    this.other.xaxis = {
      categories: empQuat
    };
  }

  /**
   * @description Format Data By Quarters So That Graph UI Looks Good.
   * Description Format Data By Quarters So That Graph UI Looks Good.
   * @param data data of respective attribute.
   * @param dataType Type of data such as benches, offices.
   * @param qtr qtr.
   * @param index index value
   * @param resp response
   * @param element element.
   */
  private formatDataByQuarters(data: any, dataType: any, qtr: any, index: number, resp: any, element: string, type: string) {
    const sumofquantitykey = 'sumofquantity';
    if (data) {
      dataType.push(data.sumofquantity);
      qtr.push(data.quat);
      if (type == 'benches') {
        this.benchGraphData.push({ quat: data.quat, value: data.sumofquantity });
      } else {
        this.officeGraphData.push({ quat: data.quat, value: data.sumofquantity });
      }
    } else if (!data) {
      ((resp[index + 1]) && resp[index + 1][sumofquantitykey]) ? dataType.push(resp[index + 1][sumofquantitykey]) : dataType.push(0);
      // officesData.push(0);
      qtr.push(element);
    }
  }

  /**
   * @description Matching the incoming item is available in longFeedsAttributes array or not
   * @param item feed item
   * @returns if itme will available in longFeedsAttributes then return true else reurn false.
   */
  public arrageFeeds(item: string) {
    let i = 0;
    for (i = 0; i < this.longFeedsAttributes.length; i++) {
      if (item.toLowerCase().includes(this.longFeedsAttributes[i].toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * @description To ignore future data.
   * @param resp resp is network response.
   * @returns past and current data not future data.
   */
   private ignoreFutureData(resp: any, yearFormate: string) {
    const currentYear = new Date().getFullYear();
    const currentQt = this.findQ(new Date())[1];
    const validdata = [];
    let yearKey = '';
    if (yearFormate === 'yyyy') {
      yearKey = yearFormate;
    } else if (yearFormate === 'year') {
      yearKey = yearFormate;
    }
    const quarterKey = 'quarterno';
    for (const item of resp) {
      if (item[yearKey] <= currentYear) {
        validdata.push(item);
      }
    }
    for (let i = 0; i < validdata.length; i++) {
      if (validdata[i][yearKey] >= currentYear && validdata[i][quarterKey] > currentQt) {
        validdata.splice(i);
      }
    }
    return validdata;
  }

  /**
   * Description: Returns the role
   * @description Returns the role
   */
  getRole() {
    return GLOBAL.USER && GLOBAL.USER.user && GLOBAL.USER.user.role;
  }

  async viewPrivacydataforSponsor() {
    if ( this.getRole() == 3) {
      if ( this.activatedRoute.parent) {
        this.activatedRoute.parent.params.subscribe(async params => {
          await (await this.privacyService.getPrivacyCompanyById(params.id)).subscribe(res => {
            this.data = res;
        });
        });
      }
    }
  }

  checkPermission(privacy: string){
    if ( this.data && this.data[privacy] && this.getRole() == 3){
      return true;
    }
    return (this.getRole() != 3 ) ? true : false;
  }

  checkFeedsPermission(privacy: any){
    if ( this.data && ( !this.data.hasOwnProperty(this.privacyData[privacy]) || this.data[this.privacyData[privacy]] )
    && this.getRole() == 3){
      return true;
    }
    return ( this.getRole() != 3 ) ? true : false;
  }

  public formatDate(desiredDate: any) {
    let dt = desiredDate;
    if (typeof desiredDate == 'number') {
      dt = new Date(desiredDate * 1000);
    }
    return this.defaultData.dateWithoutTime(dt);
  }

}
