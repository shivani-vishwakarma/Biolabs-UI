import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PublicComponent } from './public/public.component';
import { HomeComponent } from './home/home.component';
import { ResidentApplicationFormComponent } from './resident-application-form/resident-application-form.component';
import { PublicGuard } from '../core/guards/public.guard';
import { AuthGuard } from '../core/guards/auth.guard';


const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
        { path: '', redirectTo: '/home', pathMatch: 'full' },
        { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
        { path: 'apply', component: ResidentApplicationFormComponent },
        { path: 'home', component: HomeComponent, canActivate: [PublicGuard] },
        { path: 'register', component: RegisterComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'application-form', component: ResidentApplicationFormComponent, canActivate: [AuthGuard]},

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
