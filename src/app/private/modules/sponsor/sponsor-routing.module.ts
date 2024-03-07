import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { SponsorMainComponent } from './sponsor-main/sponsor-main.component';

const routes: Routes = [
  {
    path: '', component: SponsorMainComponent,
    children: [
      { path: '', redirectTo: 'sponsor', pathMatch: 'full' },
      { path: 'sponsor', component: SponsorComponent },
      { path: 'search/:searchtext', component: SearchComponent },
      { path: 'search', component: SearchComponent },
      { path: 'explore/:siteid', component: SearchComponent},
      { path: 'explore', component: SearchComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorRoutingModule { }
