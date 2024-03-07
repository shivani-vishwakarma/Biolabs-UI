import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PublicComponent } from './public/public.component';
import { HomeComponent } from './home/home.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResidentApplicationFormComponent } from './resident-application-form/resident-application-form.component';

import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    PublicComponent,
    HomeComponent,
    ResidentApplicationFormComponent,

  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TreeviewModule.forRoot(),
    FormsModule,
    NgbModule,
    TextMaskModule,
  ]
})
export class PublicModule { }
