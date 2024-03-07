import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceWaitlistRoutingModule } from './invoice-waitlist-routing.module';
import { InvoiceSummaryComponent } from './component/invoice-summary/invoice-summary.component';
import { WaitlistComponent } from './component/waitlist/waitlist.component';
import { InvoiceWaitlistComponent } from './invoice-waitlist/invoice-waitlist.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceMasterComponent } from './component/invoice-master/invoice-master.component';

@NgModule({
  declarations: [
    InvoiceSummaryComponent,
    InvoiceMasterComponent,
    WaitlistComponent,
    InvoiceWaitlistComponent
  ],
  imports: [
    CommonModule,
    InvoiceWaitlistRoutingModule,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    DragDropModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class InvoiceWaitlistModule { }
