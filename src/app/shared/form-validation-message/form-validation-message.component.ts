
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-validation-message',
  standalone: true,
  imports: [],
  templateUrl: './form-validation-message.component.html',
  styleUrl: './form-validation-message.component.scss'
})
export class FormValidationMessageComponent {

  @Input({ required: true }) validationErrors!: ValidationErrors;

}
