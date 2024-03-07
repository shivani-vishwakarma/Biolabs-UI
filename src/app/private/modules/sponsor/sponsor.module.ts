import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorRoutingModule } from './sponsor-routing.module';
import { SponsorComponent } from './sponsor/sponsor.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SponsorMainComponent } from './sponsor-main/sponsor-main.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    SponsorComponent,
    SearchComponent,
    SponsorMainComponent
  ],
  imports: [
    CommonModule,
    SponsorRoutingModule,
    NgbModule,
    FormsModule,
    TreeviewModule.forRoot(),
    NgxSpinnerModule
  ]
})
export class SponsorModule { }
