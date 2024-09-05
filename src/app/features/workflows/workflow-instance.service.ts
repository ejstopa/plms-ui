import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingService } from '../../core/loading/loading.service';
import { environment } from '../../../environments/environment';
import { CreateWorkflowInstanceDto } from './create-workflow-instance-dto';
import { finalize, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowInstanceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private apiUrl = `${environment.pxApiUrl}/workflow-instances`;

  constructor() { }

  createWorkflowInstance(itemName: string) {
    const workflowData: CreateWorkflowInstanceDto = { userId: this.authService.user()!.id, itemName: itemName };

    this.loadingService.setLoadingStart();

    return this.http.post(this.apiUrl, workflowData).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }
}
