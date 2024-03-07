import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/prevent-routing.guard';
import { CompanyComponent } from './components/company/company.component';
import { CompanyadminComponent } from './components/companyadmin/companyadmin.component';
import { CompanycardviewComponent } from './components/companycardview/companycardview.component';
import { CompanyonboardComponent } from './components/companyonboard/companyonboard.component';
import { CompanyresidenttableComponent } from './components/companyresidenttable/companyresidenttable.component';
import { CompanytableComponent } from './components/companytable/companytable.component';
import { GrowthComponent } from './components/growth/growth.component';
import { InvoicingComponent } from './components/invoicing/invoicing.component';
import { PlanchangeComponent } from './components/planchange/planchange.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RestabComponent } from './restab/restab.component';

const routes: Routes = [
  {
    path: ':id', component: RestabComponent,
    children: [
      { path: '', redirectTo: 'company', pathMatch: 'full' },
      { path: 'company', component: CompanyComponent },
      { path: 'companyadmin', component: CompanyadminComponent, canDeactivate: [CanDeactivateGuard]  },
      { path: 'onboarding', component: CompanyonboardComponent, canDeactivate: [CanDeactivateGuard]  },
      { path: 'invoicing', component: InvoicingComponent },
      { path: 'growth', component: GrowthComponent },
      { path: 'planchange', component: PlanchangeComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'companytable', component: CompanytableComponent },
      { path: 'companycardview', component: CompanycardviewComponent },
      { path: 'companyresidenttable', component: CompanyresidenttableComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidentRoutingModule { }
