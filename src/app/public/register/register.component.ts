import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/shared/utility/must-match.validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIG } from 'src/app/shared/utility/config.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    modelStartDate: any;
    modelProposeStartDate: any;
    formFields = [{
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: {},
        errorMessage: 'Name is required'
    }];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private spinner: NgxSpinnerService
        // private accountService: AccountService,
        // private alertService: AlertService
    ) {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            name: ['', [Validators.required, Validators.pattern(CONFIG.REGEX.NAME)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(CONFIG.REGEX.CONTACT_NUMBER)]],
            websiteUrl: ['', [Validators.maxLength(100), Validators.pattern(CONFIG.REGEX.WEBSITE)]],
            companyName: ['', Validators.required],
            startDate: ['', Validators.required],
            siteName: ['', Validators.required],
            proposeStartDate: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    ngOnInit() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
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

        this.loading = true;
        // this.accountService.register(this.form.value)
        //     .pipe(first())
        //     .subscribe({
        //         next: () => {
        //             // this.alertService.success('Registration successful, please check your email for verification instructions',
        // { keepAfterRouteChange: true });
        //             this.router.navigate(['../login'], { relativeTo: this.route });
        //         },
        //         error: () => {
        //             //this.alertService.error(error);
        //             this.loading = false;
        //         }
        //     });
    }
}
