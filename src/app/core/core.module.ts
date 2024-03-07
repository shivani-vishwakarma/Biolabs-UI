/**
 * In the Core Module we commonly place our singleton services and modules
 * that will be used across the app but only need to be imported once.
 * Examples are an Authentication Service or LocalStorage Service,
 * but also modules like HttpClientModule , StoreModule.forRoot(…), TranslateModule.forRoot(…)
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class CoreModule { }
