import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TreeviewModule } from 'ngx-treeview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SponsorManagementComponent } from './components/sponsor-management/sponsor-management.component';
import { ResidentManagementComponent } from './components/resident-management/resident-management.component';
import { AccountantManagementComponent } from './components/accountant-management/accountant-management.component';
import { SponsormanagerManagementComponent } from './components/sponsormanager-management/sponsormanager-management.component';
import { BusinessmanagerManagementComponent } from './components/businessmanager-management/businessmanager-management.component';
import { ResidentuserManagementComponent } from './components/residentuser-management/residentuser-management.component';


@NgModule({
  declarations: [
    UserComponent,
    UserManagementComponent,
    SponsorManagementComponent,
    ResidentManagementComponent,
    AccountantManagementComponent,
    SponsormanagerManagementComponent,
    BusinessmanagerManagementComponent,
    ResidentuserManagementComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TreeviewModule.forRoot(),
    FormsModule,
    NgbModule
  ]
})
export class UserModule { }
