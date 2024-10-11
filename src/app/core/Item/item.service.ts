import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { Model } from '../model/model';
import { catchError, finalize, forkJoin, map, Observable, of, take, tap } from 'rxjs';
import { ItemRevisionData } from './item-revision-data';
import { Item } from './item';
import { HttpResult } from '../interfaces/http-result';
import { HttpError } from '../interfaces/http-error';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/items`;

  constructor() { }

  getItemsByFamily(family: string){
    this.loadingService.setLoadingStart();
    return this.http.get<Item[]>(`${this.apiUrl}/?family=${family}`).pipe(
      take(1),
      map((items) => (
        {
          value: items.map(item => {
            return { ...item, lastModifiedAt: new Date(item.lastModifiedAt) }
          }),
          error: null
        } as HttpResult<Item[]>)
      ),
      catchError(error => of({ value: null, error: this.handleGetModelsError(error) } as HttpResult<Item[]>)),
      finalize(() => this.loadingService.setLoadingEnd())
    );
  } 

  createItem(workflowInstanceId: number){
    this.loadingService.setLoadingStart();

    return this.http.post(this.apiUrl, {WorkflowInstanceId: workflowInstanceId}).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }

  CheckoutItems(itemsRevisionData: ItemRevisionData[]) {
    this.loadingService.setLoadingStart();

    let revisedModels: string[] = [];
    let reviseActions$: Observable<object>[] = []

    for (let item of itemsRevisionData) {

      const modelRevision$ = this.http.post<Model[]>(`${environment.pxApiUrl}/items/reservations`, {itemId: item.itemId, userId: item.userId}).pipe(
        take(1),
        tap({
          next: result => result.forEach(model => revisedModels.push(`${model.name}${model.type}`)),
          error: error => alert(error.error.detail)
        })
      )
      reviseActions$.push(modelRevision$);
    }

    return forkJoin([... reviseActions$]).pipe(
      finalize(() => {
        this.loadingService.setLoadingEnd();

        if (revisedModels.length == 1) {
          alert(`Revisão reservada com sucesso \n O arquivo ${[...revisedModels]} foi enviado para a workspace`);
        }
        else if (revisedModels.length > 1) {
          alert(`Revisão reservada com sucesso \n Os arquivos ${[...revisedModels]} foram enviados para a workspace`);
        }
      })
    )
  }

  uncheckoutItems(itemsRevisionData: ItemRevisionData[]) {
    this.loadingService.setLoadingStart();

    let uncheckedOutModels: string[] = [];
    let uncheckoutActions$: Observable<object>[] = []

    for (let item of itemsRevisionData) {

      const modelRevision$ = this.http.delete<Model[]>(`${environment.pxApiUrl}/items/reservations/?itemId=${item.itemId}&userId=${this.authService.user()!.id} `).pipe(
        take(1),
        tap({
          next: result => result.forEach(item => uncheckedOutModels.push(`${item.name}${item.type}`)),
          error: error => alert(`Ocorreu um erro ao excluir a revisão do item ${item.itemName}`)
        })
      )
      uncheckoutActions$.push(modelRevision$);
    }

    return forkJoin([... uncheckoutActions$]).pipe(
      finalize(() => {
        this.loadingService.setLoadingEnd();
      })
    )
  }

  private handleGetModelsError(error: HttpErrorResponse) {
    let message = "Ocorreu um erro ao caregar os items";

    return { message: message, statusCode: error.status } as HttpError
  }

}
