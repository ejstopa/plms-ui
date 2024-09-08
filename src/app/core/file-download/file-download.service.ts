import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import FileSaver, { saveAs } from 'file-saver';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/models`;

  constructor() { }

  downLoadFile(filePath: string, fileNameWithExtension: string) {
    let filePathReplaced = filePath.replaceAll("/", "\\");
    let blob: Blob | null = null;

    this.http.get(`${this.apiUrl}/download/${encodeURIComponent(filePathReplaced)}`, {responseType: 'blob'}).pipe(
      take(1)
    ).subscribe(
      {
        next: file => {
         saveAs(file, fileNameWithExtension);
        }
      }
    )

    

    
  }


}

