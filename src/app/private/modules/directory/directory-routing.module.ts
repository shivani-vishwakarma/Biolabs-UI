import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './components/companies/companies.component';
import { DirectmembersComponent } from './components/directmembers/directmembers.component';
import { DirectsiteComponent } from './components/directsite/directsite.component';
import { DirectsponsorsComponent } from './components/directsponsors/directsponsors.component';
import { DirectComponent } from './direct/direct.component';

const routes: Routes = [
  {
    path: '', component: DirectComponent,
    children: [
      { path: '', redirectTo: 'directory-members', pathMatch: 'full' },
      { path: 'directory-companies', component: CompaniesComponent },
      { path: 'directory-site', component: DirectsiteComponent },
      { path: 'directory-members', component: DirectmembersComponent },
      { path: 'directory-sponsors', component: DirectsponsorsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule { }
