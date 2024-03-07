import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CONFIG, GLOBAL, ROLE } from 'src/app/shared/utility/config.service';
import { DefaultDataService } from 'src/app/shared/service/default-data.service';
import { EventsHubService } from 'src/app/core/services/events-hub.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  // Button loader  flag
  loading = false;
  submitted = false;
  sites: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private defaultService: DefaultDataService,
    private eventsHubService: EventsHubService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    /* These Lines are added for clear the localstorage for Session timeout */
    GLOBAL.USER = {};
    this.localStorage.deleteAll();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  /**
   * @description Used to submit login request
   * Description: Used to submit login request
   */
  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.spinner.show();
    this.loading = true;
    const response = await this.authService.login(this.f.email.value, this.f.password.value);
    response.subscribe(async resp => {
      if (resp && resp.accessToken){
        const ms = (resp.expiresIn * 1000) - (60 * 1000);
        resp.expires = new Date(new Date().getTime() + ms).getTime();
        localStorage.setItem('_expiredTime', (new Date(new Date().getTime() + resp.expiresIn * 1000).getTime()).toString());
      }
      this.defaultService.createUserSession(resp);
      await this.eventsHubService.setUserInfo(resp);
    }, error => {
      this.loading = false;
      this.toastr.error(error ? error.message : CONFIG.ERROR_MSG.SOMETHING_WRONG , '', {
        timeOut: 3000,
        closeButton: true,
        disableTimeOut: false,
      });
      this.spinner.hide();
    });
  }

  /**
   * @description Get list of sites
   * Description: Get list of sites
   */
  async getSiteList() {
    return this.sites = await this.defaultService.getSiteList();
  }
}
