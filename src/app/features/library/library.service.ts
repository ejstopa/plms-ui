import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LibraryDirectoryModel } from './library-directory.model';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs';
import { HttpResult } from '../../core/interfaces/http-result';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private http = inject(HttpClient);

  private apiUrl = computed(() => `${environment.pxApiUrl}/library`);
  private directoriesSignal = signal<HttpResult<LibraryDirectoryModel[]>>({ value: null, error: null });
  private activeDirectoryNameSignal = signal<string | null>(null);

  directories = computed(() => this.directoriesSignal().value);
  directoriesError = computed(() => this.directoriesSignal().error);
  activeDirectory = computed(() => this.directories()?.find(directory => directory.name == this.activeDirectoryNameSignal()) || null);

  constructor() { 
    this.getLibraryDirectories();
  }

  getLibraryDirectories() {
    this.http.get<LibraryDirectoryModel[]>(`${this.apiUrl()}/directories`).pipe(
      take(1)
    ).subscribe(
      {
        next: directories => this.directoriesSignal.set({ value: directories, error: null }),
        error: error => this.directoriesSignal.set({ value: null, error: error })
      }
    );
  }

  setActiveDirectory(directoryName: string | null){
    this.activeDirectoryNameSignal.set(directoryName);
  }
}
