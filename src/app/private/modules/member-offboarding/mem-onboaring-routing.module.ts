import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/prevent-routing.guard';
import { MemberOffboardingComponent } from './Component/member-offboarding/member-offboarding.component';
import { MemberOnTabComponent } from './Component/member-on-tab/member-on-tab.component';
import { MemberOnboardingComponent } from './Component/member-onboarding/member-onboarding.component';

const routes: Routes = [{
  path: ':id', component: MemberOnTabComponent,
  children: [
    { path: '', redirectTo: 'member-onboarding', pathMatch: 'full' },
    { path: 'member-tab', component: MemberOnTabComponent },
    { path: 'member-onboarding', component: MemberOnboardingComponent },
    { path: 'member-offboarding', component: MemberOffboardingComponent, canDeactivate: [CanDeactivateGuard] },
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemOnboaringRoutingModule { }
