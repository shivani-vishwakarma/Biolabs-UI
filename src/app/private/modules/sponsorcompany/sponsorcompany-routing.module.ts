import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/prevent-routing.guard';
import { SponosreditComponent } from './components/sponosredit/sponosredit.component';
import { SponsorviewComponent } from './components/sponsorview/sponsorview.component';
import { SponsortabComponent } from './sponsortab/sponsortab.component';

const routes: Routes = [
  {
    path: ':id', component: SponsortabComponent,
    children: [
      { path: '', redirectTo: 'sponsorview', pathMatch: 'full' },
      { path: 'sponsoredit', component: SponosreditComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'sponsorview', component: SponsorviewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorcompanyRoutingModule { }
