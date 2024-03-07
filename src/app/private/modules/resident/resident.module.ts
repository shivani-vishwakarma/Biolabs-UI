import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResidentRoutingModule } from './resident-routing.module';
import { CompanyComponent } from './components/company/company.component';
import { RestabComponent } from './restab/restab.component';
import { CompanyadminComponent } from './components/companyadmin/companyadmin.component';
import { ResidentApplicationsComponent } from './components/resident-applications/resident-applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyonboardComponent } from './components/companyonboard/companyonboard.component';
import { TreeviewModule } from 'ngx-treeview';
import { InvoicingComponent } from './components/invoicing/invoicing.component';
import { DataTablesModule } from 'angular-datatables';
import { GrowthComponent } from './components/growth/growth.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanchangeComponent } from './components/planchange/planchange.component';

import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { MembershipChangesComponent } from './components/planchange/membership-changes/membership-changes.component';
import { CompanyUpdatesComponent } from './components/planchange/company-updates/company-updates.component';
import { OffboardingComponent } from './components/planchange/offboarding/offboarding.component';
import { ReviewChangesComponent } from './components/planchange/review-changes/review-changes.component';
import { ThankyouComponent } from './components/planchange/thankyou/thankyou.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TwoDigitDecimaNumberDirective } from './directives/decimal.directive';
import { CompanycardviewComponent } from './components/companycardview/companycardview.component';
import { CompanytableComponent } from './components/companytable/companytable.component';
import { CompanyresidenttableComponent } from './components/companyresidenttable/companyresidenttable.component';

@NgModule({
  declarations: [
    CompanyComponent,
    RestabComponent,
    CompanyadminComponent,
    ResidentApplicationsComponent,
    CompanyonboardComponent,
    InvoicingComponent,
    GrowthComponent,
    PlanchangeComponent,
    MembershipChangesComponent,
    CompanyUpdatesComponent,
    OffboardingComponent,
    ReviewChangesComponent,
    ThankyouComponent,
    PrivacyComponent,
    TwoDigitDecimaNumberDirective,
    CompanycardviewComponent,
    CompanytableComponent,
    CompanyresidenttableComponent
  ],
  imports: [
    CommonModule,
    TreeviewModule.forRoot(),
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
export class ResidentModule { }
