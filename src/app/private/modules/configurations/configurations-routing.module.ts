import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigureComponent } from './component/configure/configure.component';
import { EventtrainigComponent } from './component/eventtrainig/eventtrainig.component';
import { OffboardingComponent } from './component/offboarding/offboarding.component';
import { OnboardingComponent } from './component/onboarding/onboarding.component';
import { PartnersponsorComponent } from './component/partnersponsor/partnersponsor.component';
import { SiteconfigureComponent } from './component/siteconfigure/siteconfigure.component';
import { ContypeComponent } from './contype/contype.component';

const routes: Routes = [
  {
    path: '', component: ContypeComponent,
    children: [
      { path: '', redirectTo: 'configure', pathMatch: 'full' },
      { path: 'siteconfigure', component: SiteconfigureComponent },
      { path: 'configure', component: ConfigureComponent },
      { path: 'eventtraining', component: EventtrainigComponent },
      { path: 'partnersponsor', component: PartnersponsorComponent },
      { path: 'offboarding', component: OffboardingComponent },
      { path: 'onboarding', component: OnboardingComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
