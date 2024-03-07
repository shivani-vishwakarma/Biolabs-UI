import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserManagementService } from '../user/services/user-management.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TreeviewModule } from 'ngx-treeview';


@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TreeviewModule.forRoot(),
    FormsModule,
    NgbModule
  ],
  providers: [
    UserManagementService
  ]
})
export class ProfileModule { }
