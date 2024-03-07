import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigureComponent } from './component/configure/configure.component';
import { ContypeComponent } from './contype/contype.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiteconfigureComponent } from './component/siteconfigure/siteconfigure.component';
import { TextMaskModule } from 'angular2-text-mask';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventtrainigComponent } from './component/eventtrainig/eventtrainig.component';
import { PartnersponsorComponent } from './component/partnersponsor/partnersponsor.component';
import { DatatablepartnerComponent } from './component/datatablepartner/datatablepartner.component';
import { DatatablesponsorComponent } from './component/datatablesponsor/datatablesponsor.component';
import { OnboardingComponent } from './component/onboarding/onboarding.component';
import { OffboardingComponent } from './component/offboarding/offboarding.component';
import { MemberOnboardingComponent } from './component/member-onboarding/member-onboarding.component';
import { MemberOffboardingComponent } from './component/member-offboarding/member-offboarding.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    ConfigureComponent,
    ContypeComponent,
    SiteconfigureComponent,
    EventtrainigComponent,
    PartnersponsorComponent,
    DatatablepartnerComponent,
    DatatablesponsorComponent,
    OnboardingComponent,
    OffboardingComponent,
    MemberOnboardingComponent,
    MemberOffboardingComponent
  ],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    TextMaskModule,
    DragDropModule,
    NgbModule,
  ]
})
export class ConfigurationsModule { }
