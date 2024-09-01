import { inject, Injectable, model } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Model } from './model';
import { catchError, finalize, forkJoin, map, mergeAll, Observable, of, take, tap } from 'rxjs';
import { HttpResult } from '../interfaces/http-result';
import { HttpError } from '../interfaces/http-error';
import { LoadingService } from '../loading/loading.service';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/models`;

  constructor() { }

  getModelsByFamily(family: string) {
    this.loadingService.setLoadingStart();
    return this.http.get<Model[]>(`${this.apiUrl}/?family=${family}`).pipe(
      take(1),
      map((models) => (
        {
          value: models.map(model => {
            return { ...model, createdAt: new Date(model.createdAt) }
          }),
          error: null
        } as HttpResult<Model[]>)
      ),
      catchError(error => of({ value: null, error: this.handleGetModelsError(error) } as HttpResult<Model[]>)),
      finalize(() => this.loadingService.setLoadingEnd())
    );
  }


  private handleGetModelsError(error: HttpErrorResponse) {
    let message = "Ocorreu um erro ao caregar os arquivos";

    if (error.status == 404) {
      message = "Nenhum arquivo encontrado"
    }

    return { message: message, statusCode: error.status } as HttpError
  }
}
