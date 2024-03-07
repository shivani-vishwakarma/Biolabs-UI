import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemOnboaringRoutingModule } from './mem-onboaring-routing.module';
import { MemberOnTabComponent } from './Component/member-on-tab/member-on-tab.component';
import { MemberOffboardingComponent } from './Component/member-offboarding/member-offboarding.component';
import { MemberOnboardingComponent } from './Component/member-onboarding/member-onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MemberOnTabComponent,
    MemberOnboardingComponent,
    MemberOffboardingComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    MemOnboaringRoutingModule,
    NgbModule
  ]
})
export class MemOnboaringModule { }
