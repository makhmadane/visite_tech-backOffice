import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'This field is required',
            'twoDecimalAllowed': 'Decimal value upto 2 decimal places is allowed.',
            'invalidNumber': 'Input should be an integer value',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'New password and confirm password does not match',
            'invalidDob': 'User must be minimum 16 Years old.',
            'invalidUrl': 'Invalid URL',
            'alphaNumericAllowed': 'Only apha numeric input is allowed',
            'numericAllowed': 'Only numeric values are allowed',
            'emailTaken': 'Email id already taken',
            'minlength': `Minimum length should be ${validatorValue.requiredLength} characters`,
            'maxlength': `Maximum length should be ${validatorValue.requiredLength} characters`
        };

        return config[validatorName];
    }

    static creditCardValidator(control: AbstractControl) {
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control: AbstractControl) {
        if (control.value.length == 0 || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static alpaNumValidator(control: AbstractControl) {
        if (control.value.match(/^[a-zA-Z0-9]*$/)) {
            return null;
        } else {
            return { 'alphaNumericAllowed': true };
        }
    }

    static numberValidator(control: AbstractControl) {
        if (control.value.length == 0 || control.value.match(/^[0-9]*$/)) {
            return null;
        } else {
            return { 'numericAllowed': true };
        }
    }

    static decimalValidation(control: AbstractControl) {
        if (control.value.match(/^\d*\.?\d{0,2}$/g)) {
            return null;
        } else {
            return { 'twoDecimalAllowed': true };
        }
    }

    static dobValidator(control: AbstractControl) {
        let currentDate = new Date();
        if (control.value) {
            let dob = new Date(control.value);
            let dobYear = dob.getFullYear();
            let maxDobYear = currentDate.getFullYear() - 16;
            if (maxDobYear < dobYear) {
                return { 'invalidDob': true };
            }
            else {
                return null
            }
        }
    }

    static urlValidator(control: AbstractControl) {
        const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|in|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        if (control.value.match(URL_REGEXP)) {
            return null;
        } else {
            return { 'invalidUrl': true };
        }
    }

    static confirmPasswordValidator(control: AbstractControl) {
        const password: string = control.get('password').value; // get password from our password form control
        const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
        if (password !== confirmPassword) {
            control.get('confirmPassword').setErrors({ invalidPassword: true });
        }
        return null
    }

}
