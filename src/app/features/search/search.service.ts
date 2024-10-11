import { computed, inject, Injectable, signal } from '@angular/core';
import { SearchData } from './search-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpResult } from '../../core/interfaces/http-result';
import { Item } from '../../core/Item/item';
import { finalize, take } from 'rxjs';
import { LoadingService } from '../../core/loading/loading.service';
import { HttpError } from '../../core/interfaces/http-error';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  http = inject(HttpClient);
  loadingService = inject(LoadingService);

  private searchResultsSignal = signal<HttpResult<Item[]>>({value: null, error: null});
  searchResults = computed(() => this.searchResultsSignal());

  constructor() { }

  executeSearch(searchData: SearchData){
    let apiUrl = `${environment.pxApiUrl}/items/query` 

    this.loadingService.setLoadingStart();

    this.http.post<Item[]>(apiUrl, searchData).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    ).subscribe({
      next: items => this.searchResultsSignal.set({value: items, error: null}),
      error: error => this.searchResultsSignal.set({value: null, error: {message: "Ocorreu um erro ao realizar a pesquisa"} as HttpError})
    });
  }

  clearSearchResults(){
      this.searchResultsSignal.set({value: null, error: null});
  }

}
