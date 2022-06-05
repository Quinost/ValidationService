import { AfterContentInit, Component, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-message-footer',
  templateUrl: './message-footer.component.html',
  styleUrls: ['./message-footer.component.scss']
})
export class MessageFooterComponent implements ControlValueAccessor, AfterContentInit {
  formControl = new FormControl();

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(_: any) { }
  registerOnChange(_: any) { }
  registerOnTouched(_: any) { }

  ngAfterContentInit(): void {
    if (this.ngControl)
      this.formControl = this.ngControl.control as FormControl;
  }

  get getValidationMessage(): string {
    const error = this.formControl.errors;
    for (const item of this.errorMessages) {
      const validator = error![item.name];
      if (validator) {
        const values = this.additionalValues(validator);
        return item.method(values);
      }
    }
    console.error(`Validation not implemented for validator: ${JSON.stringify(error)} `)
    return '';
  }

  additionalValues(error: any): Map<string, string> {
    const values = new Map<string, string>();

    for (let item of additionalValueNames) {
      if (error[item])
        values.set(item, error[item]);
    }
    return values;
  }

  parseString(values: Map<string, string>, text: string): string {
    for (let item of values) {
      text = text.replace(`{${item[0]}}`, item[1]);
    }
    return text;
  }

  errorMessages: TranslateMethod[] = [
    { name: ErrorForValidator.Required, method: (_) => required },
    { name: ErrorForValidator.Maxlength, method: (values: Map<string, string>) => this.parseString(values, maxLength), },
    { name: ErrorForValidator.Minlength, method: (values: Map<string, string>) => this.parseString(values, minLength), },
    { name: ErrorForValidator.Max, method: (values: Map<string, string>) => this.parseString(values, max), },
    { name: ErrorForValidator.Min, method: (values: Map<string, string>) => this.parseString(values, min), },
    { name: ErrorForValidator.CustomValidator, method: (values: Map<string, string>) => this.parseString(values, abondendWord), },
  ];
}

interface TranslateMethod {
  name: ErrorForValidator;
  method: (valuesToParse: Map<string, string>) => string
}

enum ErrorForValidator {
  Required = "required",
  Email = "email",
  Max = "max",
  Maxlength = "maxlength",
  Min = "min",
  Minlength = "minlength",
  CustomValidator = "customValidator"
}

const additionalValueNames: string[] = [
  'requiredLength',
  'max',
  'min',
  'requiredPattern',
  'abondendWord',
  'allowedWord',
]

const required = 'Field required';
const maxLength = 'Max lenght: {requiredLength}';
const minLength = 'Min lenght: {requiredLength}';
const min = 'Min: {min}';
const max = 'Max: {max}';
const abondendWord = 'Abondend word: {abondendWord}. Allowed word: {allowedWord}';
