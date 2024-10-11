import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { ItemFamily } from './item-family';
import { finalize, take } from 'rxjs';
import { HttpResult } from '../interfaces/http-result';
import { ItemAttribute } from '../Item/item-attribute';

@Injectable({
  providedIn: 'root'
})
export class ItemFamilyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/item-families`;

  private itemFamiliesSignal = signal<HttpResult<ItemFamily[]>>({value: null, error: null});
  private activeItemFamilyNameSignal = signal<string | null>(null);

  itemFamilies = computed(() => this.itemFamiliesSignal().value);
  itemFamiliesError = computed(() => this.itemFamiliesSignal().error);
  activeItemFamily = computed(() => this.itemFamilies()?.find(itemFamily => itemFamily.name == this.activeItemFamilyNameSignal()) || null);

  constructor() { 
    this.getAllItemFamilies();
  }

  getAllItemFamilies(){
    this.http.get<ItemFamily[]>(this.apiUrl).pipe(
      take(1)
    ).subscribe(
      {
        next: itemFamilies => this.itemFamiliesSignal.set({value: itemFamilies, error: null}),
        error: error => this.itemFamiliesSignal.set({value: null, error: error})
      }
    );
  }

  setActiveItemFamily(itemFamilyName: string | null){
    this.activeItemFamilyNameSignal.set(itemFamilyName);
  }

  getItemFamilyAttributes(itemFamilyId: number){
    this.loadingService.setLoadingStart();

    return this.http.get<ItemAttribute[]>(`${this.apiUrl}/${itemFamilyId}/attributes`).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }


}
