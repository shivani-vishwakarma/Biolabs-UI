import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/prevent-routing.guard';
import { CompanyOffboardingComponent } from './component/company-offboarding/company-offboarding.component';
import { CompanyOnboardingComponent } from './component/company-onboarding/company-onboarding.component';
import { OnboardingTabComponent } from './component/onboarding-tab/onboarding-tab.component';

const routes: Routes = [{
    path: ':id', component: OnboardingTabComponent,
    children: [
      { path: '', redirectTo: 'company-onboarding', pathMatch: 'full' },
      {  path: 'company-tab', component: OnboardingTabComponent },
      { path: 'company-onboarding', component: CompanyOnboardingComponent },
      { path: 'company-offboarding', component: CompanyOffboardingComponent   },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
