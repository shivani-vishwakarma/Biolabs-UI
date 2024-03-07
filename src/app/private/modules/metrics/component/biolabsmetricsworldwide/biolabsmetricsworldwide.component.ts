import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MetricsService } from '../../services/metrics.service';
@Component({
  selector: 'app-biolabsmetricsworldwide',
  templateUrl: './biolabsmetricsworldwide.component.html',
  styleUrls: ['./biolabsmetricsworldwide.component.css']
})
export class BiolabsmetricsworldwideComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  worldWideStandardPrice: any;
  worldWideSummary: any;
  worldWideTotal: any;

  constructor(private metricsService: MetricsService) { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'lfBrtip',
      ordering: true,
      buttons: [
        {
          extend: 'csv',
          title: 'Standard Price Comparision',
          footer: true,
        }
      ]
    };
    this.getWorldWideStandardPrice();
    this.getWorldWideSummary();
    this.getWorldWideTotal();
  }

  getWorldWideStandardPrice(){
    this.metricsService.getWorldWideStandardPrice().subscribe((res: any) => {
      this.worldWideStandardPrice = res.data;
      this.dtTrigger.next();
    });
  }

  getWorldWideSummary(){
    this.metricsService.getWorldWideSummary().subscribe((res: any) => {
      this.worldWideSummary = res.data;
    });
  }

  getWorldWideTotal(){
    this.metricsService.getWorldWideTotal().subscribe((res: any) => {
      this.worldWideTotal = res.data[0] || [];
    });
  }
}
