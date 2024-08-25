import { inject } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from './auth.service';

export function AuthGuard(): boolean{
    if (inject(AuthService).isLoggedIn()){
        return true;
    }
    else{
        inject(Router).navigate(["login"]);
        return false;
    }
}