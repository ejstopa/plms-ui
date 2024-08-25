import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserLogin } from '../user-login';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';
import { FormValidationMessageComponent } from '../../../shared/form-validation-message/form-validation-message.component';
import { FormInputComponent } from "../../../shared/form-input/form-input.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoadingComponent, FormValidationMessageComponent, FormInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private user = computed(() => this.authService.user());
  private loginSucces = effect(() => this.user()? this.router.navigate([""]) : "");

  loginError = computed(() => this.authService.error());
  showValidationMessages = false;
  showPassword = false;

  loginForm = new FormGroup({
    userName: new FormControl("", [Validators.required]),
    userPassword: new FormControl("", [Validators.required])
  });

  onSubmit() {
    this.showValidationMessages = true;
    
    if (this.loginForm.invalid){
      console.log(this.loginForm.controls.userName)
      return;
    }

    let userLogin: UserLogin = {
      name: this.loginForm.value.userName!,
      password: this.loginForm.value.userPassword!
    }

    this.authService.logIn(userLogin);
  }

  toggleShowPassword(){
    this.showPassword = !this.showPassword;
  }
}
