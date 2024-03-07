import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiolabsmetricsComponent } from './component/biolabsmetrics/biolabsmetrics.component';
import { BiolabsmetricsdashboardComponent } from './component/biolabsmetricsdashboard/biolabsmetricsdashboard.component';
import { BiolabsmetricsworldwideComponent } from './component/biolabsmetricsworldwide/biolabsmetricsworldwide.component';
import { DashboardsummarytableComponent } from './component/dashboardsummarytable/dashboardsummarytable.component';
import { SitemetricsComponent } from './component/sitemetrics/sitemetrics.component';
import { MetricsComponent } from './metrics/metrics.component';

const routes: Routes = [
  {
    path: '', component: MetricsComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: 'management', component: UserManagementComponent },
      { path: 'metrics', component: MetricsComponent },
      // { path: 'biolabmetrics', component: BiolabsmetricsComponent },
      { path: 'dashboard', component: BiolabsmetricsdashboardComponent },
      { path: 'worldwide', component: BiolabsmetricsworldwideComponent },
      { path: 'sitemetrics', component: SitemetricsComponent },
      { path: 'dashboardsummarytable', component: DashboardsummarytableComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetricsRoutingModule { }
