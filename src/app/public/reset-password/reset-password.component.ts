import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/shared/utility/must-match.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from 'src/app/shared/utility/config.service';
import { environment } from 'src/environments/environment';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token = null;
  form: FormGroup;
  loading = false;
  submitted = false;
  modaltitle = false;
  tcfile = `${environment.tncInvite}`;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required,
        Validators.pattern(new RegExp('^(((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})'))]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacypolicy: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParams.token;
    this.validateToken(token);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  /**
   * @description Validate the link from email
   * Description: Validate the link from email
   * @param token Access Token
   */
  async validateToken(token: any) {
    this.spinner.show();
    const response = await this.authService.verifyUser(token);
    response.subscribe(resp => {
      this.spinner.hide();
      this.token = token;
      this.tokenStatus = TokenStatus.Valid;
    }, error => {
      this.spinner.hide();
      this.tokenStatus = TokenStatus.Invalid;
    });
  }


  onSubmit() {
    this.submitted = true;

    // reset alerts on submit

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.setPassword();

    this.loading = true;
  }

  /**
   * Description: Used to set password
   * @description Used to set password
   */
  async setPassword() {
    this.spinner.show();
    const body = {
      token: this.token,
      password: this.form.value.password,
      passwordConfirmation: this.form.value.confirmPassword
    };
    const response = await this.authService.resetPassword(body);
    response.subscribe(resp => {
      this.toastr.success(CONFIG.SUCCESS_MSG.PASS_SET, '', {
        timeOut: 1000,
        closeButton: true
      });
      this.spinner.hide();
      this.router.navigate(['/login'], { relativeTo: this.route, replaceUrl: true });
    }, error => {
      this.toastr.error(CONFIG.ERROR_MSG.PASS_SET, '', {
        timeOut: 1000,
        closeButton: true
      });
      this.spinner.hide();
    });
  }

}
