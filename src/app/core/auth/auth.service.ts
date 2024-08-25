import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserLogin } from './user-login';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpResult } from '../interfaces/http-result';
import { UserModel } from './user.model';
import { HttpError } from '../interfaces/http-error';
import { finalize, take} from 'rxjs';
import { LoadingService } from '../loading/loading.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/users/login`;
  private tokenName = "plms-token"
  private http = inject(HttpClient);
  private userResult = signal<HttpResult<UserModel>>({ value: null, error: null });

  user = computed(() => this.userResult().value);
  error = computed(() => this.userResult().error);

  constructor() {
    if (sessionStorage.getItem(this.tokenName)){
      let user: UserModel = JSON.parse(sessionStorage.getItem(this.tokenName)!);
      this.userResult.set({value: user, error: null});
    }
  }

  logIn(userLogin: UserLogin) {
    this.loadingService.setLoadingStart();
    
    setTimeout(() => {
      this.http.post<UserModel>(this.apiUrl, userLogin).pipe(
        take(1),
        finalize(() => {
          this.loadingService.setLoadingEnd();
        } )
      ).subscribe({
        next: user => {
          this.userResult.set({ value: user, error: null });
          sessionStorage.setItem(this.tokenName, JSON.stringify(user));
        } ,
        error: error => this.userResult.set({value: null, error: this.handleLoginError(error)}) 
      })
    }, 1000);

  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.tokenName) != null;
  }

  private handleLoginError(error: HttpErrorResponse): HttpError {
    let errorStatusCode = error.status;
    let errorMessage = "Erro ao tentar efetuar o login";

    if (errorStatusCode == 401){
      errorMessage = "Usuário ou senha inválidos";
    }

    return {statusCode: errorStatusCode, message:errorMessage};
  }
}
