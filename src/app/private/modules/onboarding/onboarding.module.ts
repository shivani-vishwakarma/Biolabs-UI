import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingTabComponent } from './component/onboarding-tab/onboarding-tab.component';
import { CompanyOnboardingComponent } from './component/company-onboarding/company-onboarding.component';
import { CompanyOffboardingComponent } from './component/company-offboarding/company-offboarding.component';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    OnboardingTabComponent,
    CompanyOnboardingComponent,
    CompanyOffboardingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class OnboardingModule { }
