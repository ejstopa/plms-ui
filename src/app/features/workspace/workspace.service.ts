import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { finalize, map, take } from 'rxjs';
import { HttpResult } from '../../core/interfaces/http-result';
import { LoadingService } from '../../core/loading/loading.service';
import { Item } from '../../core/Item/item';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private apiUrl = computed(() =>`${environment.pxApiUrl}/users/${this.authService.user()?.id}/workspace/items`);
  private workspaceFilesSignal = signal<HttpResult<Item[]>>({value: null, error:null});

  workspaceFiles = computed(() => this.workspaceFilesSignal().value);
  workspaceFilesError = computed(() => this.workspaceFilesSignal().error);
  
  constructor() { 
   
  }

  getWorkspaceFiles(){
    this.loadingService.setLoadingStart();

    this.http.get<Item[]>(this.apiUrl()).pipe(
      take(1),
      map(files => files.map(file => {
        return {...file, lastModifiedAt: new Date(file.lastModifiedAt)};
      })),
      finalize(() => this.loadingService.setLoadingEnd())
    ).subscribe({
      next: files => this.workspaceFilesSignal.set({value: files, error: null}),
      error: error => this.workspaceFilesSignal.set({value: null, error: error})
    });
  }

  deleteWorkspaceFile(filePath: string){
    let apiUrl = computed(() =>`${environment.pxApiUrl}/users/${this.authService.user()?.id}/workspace-files`);
    let filePathReplaced = filePath.replaceAll("/", "\\");
    let url = `${apiUrl()}/${encodeURIComponent(filePathReplaced)}`;

    return this.http.delete(url).pipe(
      take(1));
  }
}
