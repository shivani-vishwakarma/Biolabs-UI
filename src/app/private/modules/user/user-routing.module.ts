import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SponsorManagementComponent } from './components/sponsor-management/sponsor-management.component';
import { ResidentManagementComponent } from './components/resident-management/resident-management.component';
import { AccountantManagementComponent } from './components/accountant-management/accountant-management.component';
import { SponsormanagerManagementComponent } from './components/sponsormanager-management/sponsormanager-management.component';
import { BusinessmanagerManagementComponent } from './components/businessmanager-management/businessmanager-management.component';
import { ResidentuserManagementComponent } from './components/residentuser-management/residentuser-management.component';

const routes: Routes = [
  {
    path: '', component: UserComponent,
    children: [
      { path: '', redirectTo: 'management', pathMatch: 'full' },
      { path: 'management', component: UserManagementComponent },
      { path: 'sponsor', component: SponsorManagementComponent },
      { path: 'resident', component: ResidentManagementComponent },
      { path: 'accountant', component: AccountantManagementComponent },
      { path: 'sponsormanager', component: SponsormanagerManagementComponent },
      { path: 'businessmanager', component: BusinessmanagerManagementComponent },
      { path: 'residentuser', component: ResidentuserManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
