import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/prevent-routing.guard';
import { SpdataComponent } from './components/spdata/spdata.component';
import { SpeditprofileComponent } from './components/speditprofile/speditprofile.component';
import { SpprofileComponent } from './components/spprofile/spprofile.component';
import { SptabprofileComponent } from './components/sptabprofile/sptabprofile.component';
import { SpviewprofileComponent } from './components/spviewprofile/spviewprofile.component';
import { SpusertabComponent } from './spusertab/spusertab.component';

const routes: Routes = [
  {
    path: '', component: SpusertabComponent,
    children: [
      { path: '', redirectTo: 'spdata', pathMatch: 'full' },
      { path: 'spusertab', component: SpusertabComponent },
      { path: 'spdata', component: SpdataComponent },
      { path: 'spprofile', component: SpprofileComponent, canDeactivate: [CanDeactivateGuard]   },
      { path: 'sptabprofile/:id', component: SptabprofileComponent,
        children: [
          { path: 'spviewprofile', component: SpviewprofileComponent },
          { path: 'speditprofile', component: SpeditprofileComponent, canDeactivate: [CanDeactivateGuard] },
        ]
      },
      // { path: 'accountant', component: AccountantManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorusersRoutingModule { }
