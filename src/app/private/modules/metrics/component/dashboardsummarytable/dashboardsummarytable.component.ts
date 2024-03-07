import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboardsummarytable',
  templateUrl: './dashboardsummarytable.component.html',
  styleUrls: ['./dashboardsummarytable.component.css']
})

export class DashboardsummarytableComponent implements OnInit, OnChanges {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  @Input() worldWideSummary: any;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: false,
      bFilter: false,
      bInfo: false,
      dom: 'lfBrtip',
      ordering: true,
      scrollX: 400,
      scrollY: 350,
      buttons: [
        {
          extend: 'csv',
          title: 'Summary of Site Leasable Space and Potential Revenue',
          footer: true,
        }
      ]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.worldWideSummary = changes.worldWideSummary.currentValue;
      this.dtTrigger.next();
  }
}
