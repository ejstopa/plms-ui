import { HttpClient } from '@angular/common/http';
import { ApplicationModule, computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingService } from '../../core/loading/loading.service';
import { environment } from '../../../environments/environment';
import { CreateWorkflowInstanceDto } from './create-workflow-instance-dto';
import { finalize, take } from 'rxjs';
import { WorkflowInstance } from './workflow-instance';
import { HttpResult } from '../../core/interfaces/http-result';
import { WorkflowStep } from './workflow-step';

@Injectable({
  providedIn: 'root'
})
export class WorkflowInstanceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  private userWorkflowsSignal = signal<HttpResult<WorkflowInstance[]>>({value: null, error: null});
  
  userWorkflows = computed(() => this.userWorkflowsSignal().value);
  userWorkflowsError = computed(() => this.userWorkflowsSignal().error);

  constructor() { }

  createWorkflowInstance(itemName: string) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances`;
    const workflowData: CreateWorkflowInstanceDto = { userId: this.authService.user()!.id, itemName: itemName };

    this.loadingService.setLoadingStart();

    return this.http.post(apiUrl, workflowData).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }

  getUserWorkflows() {
    const apiUrl = `${environment.pxApiUrl}/users/${this.authService.user()!.id}/workflow-instances`;
    
    this.loadingService.setLoadingStart();

    this.http.get<WorkflowInstance[]>(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    ).subscribe(
      {
        next: result => this.userWorkflowsSignal.set({value: result, error: null}),
        error: error => this.userWorkflowsSignal.set({value: null, error: error})
      }
    );
  }

  getWorkflowSteps(workflowId: number){
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}/steps`;

    this.loadingService.setLoadingStart();

    return this.http.get<WorkflowStep[]>(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )

  }
}
