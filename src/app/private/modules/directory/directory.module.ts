import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectComponent } from './direct/direct.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DirectsiteComponent } from './components/directsite/directsite.component';
import { DirectmembersComponent } from './components/directmembers/directmembers.component';
import { DirectsponsorsComponent } from './components/directsponsors/directsponsors.component';


@NgModule({
  declarations: [
    DirectComponent,
    CompaniesComponent,
    DirectsiteComponent,
    DirectmembersComponent,
    DirectsponsorsComponent
  ],
  imports: [
    CommonModule,
    DirectoryRoutingModule
  ]
})
export class DirectoryModule { }
