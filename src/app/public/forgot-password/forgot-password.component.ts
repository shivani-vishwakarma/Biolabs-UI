import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { CONFIG } from 'src/app/shared/utility/config.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.sendForgotPasswordEmail();
  }

  async sendForgotPasswordEmail() {
    this.spinner.show();
    const body = {
      email: this.form.value.email,
    };
    const response = await this.authService.forgotPassword(body);
    response.subscribe(resp => {
      this.toastr.success(CONFIG.SUCCESS_MSG.FORGOTMAIL_SENT, '', {
        timeOut: 5000,
        closeButton: true
      });
      this.spinner.hide();
    }, error => {
      this.toastr.success(CONFIG.ERROR_MSG.FORGOTMAIL_SENT, '', {
        timeOut: 5000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }
}
