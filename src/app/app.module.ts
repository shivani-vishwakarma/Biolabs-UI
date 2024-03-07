import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptor/TokenInterceptor';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { CustomAdapter } from './shared/service/date-adapters/custom-adapter.service';
import { CustomDateParserFormatter } from './shared/service/date-adapters/custom-date-parser-formatter.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    CoreModule,
    NgbModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },
    DatePipe, BnNgIdleService,
  { provide: NgbDateAdapter, useClass: CustomAdapter },
  { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  bootstrap: [AppComponent],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
