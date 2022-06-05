import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function createValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value)
            return null;

        let valid = value === 'hello' || value !== 'hi';
        return valid ? { customValidator: { abondendWord: 'hello', allowedWord: 'hi' } } : null;
    }
}