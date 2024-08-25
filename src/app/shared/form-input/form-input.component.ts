import { Component, computed, inject, input, OnInit, Optional, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { FormValidationMessageComponent } from '../form-validation-message/form-validation-message.component';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [FormValidationMessageComponent, FormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements ControlValueAccessor {
  ngControl = inject(NgControl, {optional: true});

  labelText = input.required<string>();
  type = input.required<string>();
  showValidationError = input.required<boolean>();
  
  inputValue = "";
  showPassword = signal<boolean>(false);
  inputType = computed(() => this.showPassword()? "text" : this.type());

  onTouched? = () => {};
  onChange? = (value: string) => {};
  isDisabled = false;
 
  constructor(){
    if (this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: string): void {
    this.inputValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleShowPassword(){
    this.showPassword.set(!this.showPassword());
  }



}
