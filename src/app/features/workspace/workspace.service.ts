import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { finalize, map, take } from 'rxjs';
import { HttpResult } from '../../core/interfaces/http-result';
import { FileData } from '../../core/file/file-data';
import { LoadingService } from '../../core/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private apiUrl = computed(() =>`${environment.pxApiUrl}/users/${this.authService.user()?.id}/workspace-files`);
  private workspaceFilesSignal = signal<HttpResult<FileData[]>>({value: null, error:null});

  workspaceFiles = computed(() => this.workspaceFilesSignal());

  constructor() { 
   
  }

  getWorkspaceFiles(){
    this.loadingService.setLoadingStart();

    this.http.get<FileData[]>(this.apiUrl()).pipe(
      take(1),
      map(files => files.map(file => {
        return {...file, lastModifiedAt: new Date(file.lastModifiedAt)};
      })),
      finalize(() => this.loadingService.setLoadingEnd())
    ).subscribe({
      next: files => this.workspaceFilesSignal.set({value: files, error: null}),
      error: error => alert(error)
    });
  }

  deleteWorkspaceFile(filePath: string){
    let filePathReplaced = filePath.replaceAll("/", "\\");
    let url = `${this.apiUrl()}/${encodeURIComponent(filePathReplaced)}`;

    return this.http.delete(url).pipe(
      take(1));
  }
}
