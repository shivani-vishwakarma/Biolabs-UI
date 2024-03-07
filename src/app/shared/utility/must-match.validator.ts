import { FormControl, FormGroup, Validators } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

/**
 * makes the field required if the predicate function returns true
 */
export function requiredIfValidator(controlName: string, chekbox: boolean) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if (chekbox && control.value) {
            control.setErrors({ required: true });
        } else {
            control.setErrors(null);

        }
        return null;
    };
}
