import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorusersRoutingModule } from './sponsorusers-routing.module';
import { SpusertabComponent } from './spusertab/spusertab.component';
import { SpdataComponent } from './components/spdata/spdata.component';
import { SpprofileComponent } from './components/spprofile/spprofile.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SptabprofileComponent } from './components/sptabprofile/sptabprofile.component';
import { SpviewprofileComponent } from './components/spviewprofile/spviewprofile.component';
import { SpeditprofileComponent } from './components/speditprofile/speditprofile.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    SpusertabComponent,
    SpdataComponent,
    SpprofileComponent,
    SptabprofileComponent,
    SpviewprofileComponent,
    SpeditprofileComponent
  ],
  imports: [
    CommonModule,
    SponsorusersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    DragDropModule,
    NgbModule,
    TreeviewModule.forRoot(),
  ]
})
export class SponsorusersModule { }
