import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsComponent } from './metrics/metrics.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ResidentRoutingModule } from '../resident/resident-routing.module';
import { SitemetricsComponent } from './component/sitemetrics/sitemetrics.component';
import { BiolabsmetricsComponent } from './component/biolabsmetrics/biolabsmetrics.component';
import { BiolabsmetricsdashboardComponent } from './component/biolabsmetricsdashboard/biolabsmetricsdashboard.component';
import { BiolabsmetricsworldwideComponent } from './component/biolabsmetricsworldwide/biolabsmetricsworldwide.component';
import { ResidentmetricsComponent } from './component/residentmetrics/residentmetrics.component';
import { DashboardsummarytableComponent } from './component/dashboardsummarytable/dashboardsummarytable.component';


@NgModule({
  declarations: [
    MetricsComponent,
    SitemetricsComponent,
    BiolabsmetricsComponent,
    BiolabsmetricsdashboardComponent,
    BiolabsmetricsworldwideComponent,
    ResidentmetricsComponent,
    DashboardsummarytableComponent
  ],
  imports: [
    CommonModule,
    MetricsRoutingModule,
    TextMaskModule,
    ResidentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    NgApexchartsModule,
    NgbModule,
    CdkStepperModule,
    NgStepperModule,
    TextMaskModule
  ]
})
export class MetricsModule { }
