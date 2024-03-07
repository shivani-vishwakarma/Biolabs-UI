import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorcompanyRoutingModule } from './sponsorcompany-routing.module';
import { SponsortabComponent } from './sponsortab/sponsortab.component';
import { SponsorviewComponent } from './components/sponsorview/sponsorview.component';
import { SponosreditComponent } from './components/sponosredit/sponosredit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { TreeviewModule } from 'ngx-treeview';


@NgModule({
  declarations: [
    SponsortabComponent,
    SponsorviewComponent,
    SponosreditComponent
  ],
  imports: [
    CommonModule,
    SponsorcompanyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    DragDropModule,
    NgbModule,
    TreeviewModule.forRoot(),
  ]
})
export class SponsorcompanyModule { }
