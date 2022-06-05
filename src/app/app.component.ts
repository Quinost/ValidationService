import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { createValidator } from './custom-validator';
import { getParsedValidationMessage } from './validator/validation-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ValidationService';
  fg: FormGroup;

  constructor(private fb: FormBuilder){
    this.fg = fb.group({
      firstInput: [null, Validators.required],
      secondInput: [null, Validators.minLength(3)],
      thirdInput: [null, Validators.maxLength(5)],
      fourthInput: [null, createValidator()],
    })
  }

  getValidationMessage(formControlName: string){
    const fc = this.fg.get(formControlName)?.errors as ValidationErrors;    
    return getParsedValidationMessage(fc);
  }
}
