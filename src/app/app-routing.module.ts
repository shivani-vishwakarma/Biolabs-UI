import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';
import { ErrorComponent } from './core/error/error.component';
import { RestabComponent } from './private/modules/resident/restab/restab.component';
import { ResidentApplicationFormComponent } from './public/resident-application-form/resident-application-form.component';
import { ResidentApplicationsComponent } from './private/modules/resident/components/resident-applications/resident-applications.component';
import { SuccessfulComponent } from './core/successful/successful.component';
import { DirectComponent } from './private/modules/directory/direct/direct.component';
import { MetricsModule } from './private/modules/metrics/metrics.module';
import { BiolabsmetricsdashboardComponent } from './private/modules/metrics/component/biolabsmetricsdashboard/biolabsmetricsdashboard.component';
import { SponsortabComponent } from './private/modules/sponsorcompany/sponsortab/sponsortab.component';

const publicModule = () => import('./public/public.module').then(m => m.PublicModule);
const userModule = () => import('./private/modules/user/user.module').then(m => m.UserModule);
const profileModule = () => import('./private/modules/profile/profile.module').then(m => m.ProfileModule);
const residentModule = () => import('./private/modules/resident/resident.module').then(m => m.ResidentModule);
const sponsorModule = () => import('./private/modules/sponsor/sponsor.module').then(m => m.SponsorModule);
const directoryModule = () => import('./private/modules/directory/directory.module').then(m => m.DirectoryModule);
const configurationsModule = () => import('./private/modules/configurations/configurations.module').then(m => m.ConfigurationsModule);
const invoicewaitlistyModule = () => import('./private/modules/invoice-waitlist/invoice-waitlist.module').then
(m => m.InvoiceWaitlistModule);
const metricsModule = () => import('./private/modules/metrics/metrics.module').then(m => m.MetricsModule);
const sponsorusersModule = () => import('./private/modules/sponsorusers/sponsorusers.module').then(m => m.SponsorusersModule);
const OnboardingModule = () => import('./private/modules/onboarding/onboarding.module').then(m => m.OnboardingModule);
const sponsorcompanyModule = () => import('./private/modules/sponsorcompany/sponsorcompany.module').then(m => m.SponsorcompanyModule);
const MemOnboaringModule = () => import('./private/modules/member-offboarding/mem-onboaring.module').then(m => m.MemOnboaringModule);

const routes: Routes = [
  { path: '', loadChildren: publicModule },
  { path: 'metrics', loadChildren: metricsModule, canActivate: [AuthGuard] },
  { path: 'user', loadChildren: userModule, canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: 'success', component: SuccessfulComponent },

  { path: 'restab', component: RestabComponent },
  { path: 'resident-companies', loadChildren: residentModule, canActivate: [AuthGuard]  },
  { path: 'sponsor-view', loadChildren: sponsorModule, canActivate: [AuthGuard]  },
  //  (Site Admin landing page list of applications)
  { path: 'applications', component: ResidentApplicationsComponent, canActivate: [AuthGuard] },

  { path: 'directory', loadChildren: directoryModule, canActivate: [AuthGuard]}, //  (Resident landing page)
  { path: 'configurations', loadChildren: configurationsModule, canActivate: [AuthGuard]},
  { path: 'invoice-waitlist', loadChildren: invoicewaitlistyModule, canActivate: [AuthGuard]},
  { path: 'onboardingtab', loadChildren: OnboardingModule },
  { path: 'spusertab', loadChildren: sponsorusersModule, canActivate: [AuthGuard] },
  { path: 'sponsortab', component: SponsortabComponent },
  { path: 'sponsor-companies', loadChildren: sponsorcompanyModule, canActivate: [AuthGuard] },
  { path: 'member-tab', loadChildren: MemOnboaringModule },
  { path: 'companytab', loadChildren: OnboardingModule },
  // { path: 'metrics', loadChildren: metricsModule, canActivate: [AuthGuard]},
  // { path: 'metrics', loadChildren: metricsModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
