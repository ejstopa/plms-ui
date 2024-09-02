import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { Model } from '../model/model';
import { UserModel } from '../auth/user.model';
import { finalize, forkJoin, Observable, take, tap } from 'rxjs';
import { ItemRevisionData } from './item-revision-data';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/items`;

  constructor() { }

  CheckoutItems(itemsRevisionData: ItemRevisionData[]) {
    this.loadingService.setLoadingStart();

    let revisedModels: string[] = [];
    let reviseActions$: Observable<object>[] = []

    for (let item of itemsRevisionData) {

      const modelRevision$ = this.http.post<Model[]>(`${environment.pxApiUrl}/items/reservations`, {itemId: item.itemId, userId: item.userId}).pipe(
        take(1),
        tap({
          next: result => result.forEach(model => revisedModels.push(`${model.name}${model.type}`)),
          error: error => alert(`Ocorreu um erro ao criar uma revisão para o item ${item.selectedModelName}`)
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
          next: result => result.forEach(model => uncheckedOutModels.push(`${model.name}${model.type}`)),
          error: error => alert(`Ocorreu um erro ao excluir a revisão do item ${item.selectedModelName}`)
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

}
