import { HttpClient } from '@angular/common/http';
import { ApplicationModule, computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingService } from '../../core/loading/loading.service';
import { environment } from '../../../environments/environment';
import { CreateWorkflowInstanceDto } from './create-workflow-instance-dto';
import { finalize, forkJoin, Observable, take, tap } from 'rxjs';
import { WorkflowInstance } from './workflow-instance';
import { HttpResult } from '../../core/interfaces/http-result';
import { WorkflowStep } from './workflow-step';
import { CreateWorkflowValueDto } from './create-workflow-value-dto';
import { WorkflowInstanceValue } from './workflow-instance-value';
import { WorkflowReturnData } from './workflow-return-data';

@Injectable({
  providedIn: 'root'
})
export class WorkflowInstanceService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  private userWorkflowsSignal = signal<HttpResult<WorkflowInstance[]>>({ value: null, error: null });
  private userTasksSignal = signal<HttpResult<WorkflowInstance[]>>({ value: null, error: null });

  userWorkflows = computed(() => this.userWorkflowsSignal().value);
  userWorkflowsError = computed(() => this.userWorkflowsSignal().error);

  userWorkflowsTasks = computed(() => this.userTasksSignal().value);
  userWorkflowsTasksError = computed(() => this.userTasksSignal().error);

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
        next: result => this.userWorkflowsSignal.set({ value: result, error: null }),
        error: error => this.userWorkflowsSignal.set({ value: null, error: error })
      }
    );
  }

  getUserWorkflowsTasks() {
    const apiUrl = `${environment.pxApiUrl}/departments/${this.authService.user()?.roleId}/workflow-Tasks`;

    this.loadingService.setLoadingStart();

    this.http.get<WorkflowInstance[]>(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    ).subscribe(
      {
        next: result => {
          this.userTasksSignal.set({ value: result, error: null });
        },
        error: error => this.userTasksSignal.set({ value: null, error: error })
      }
    );
  }

  getWorkflowSteps(workflowId: number) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}/steps`;

    this.loadingService.setLoadingStart();

    return this.http.get<WorkflowStep[]>(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }

  createWorkflowValue(workflowId: number, values: CreateWorkflowValueDto[]) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}/attibute-values`;

    this.loadingService.setLoadingStart();

    let createActions$: Observable<object>[] = [];

    for (let value of values) {
      const { itemAttributeName, ...valueWithoutName } = value;

      const valueCreation$ = this.http.post<CreateWorkflowValueDto>(apiUrl, valueWithoutName).pipe(
        take(1),
        tap({
          error: error => alert(`Ocorreu em erro ao atualizar o valor do atributo: ${value.itemAttributeName}\n
                  '${error.error.detail}'`)
        })
      )

      createActions$.push(valueCreation$);
    }

    return forkJoin([...createActions$]).pipe(
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }

  getWorkflowValues(workflowId: number) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}/attibute-values`;

    this.loadingService.setLoadingStart();

    return this.http.get<WorkflowInstanceValue[]>(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd())
    )
  }

  completeStep(workflowId: number) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}/step-completions`;

    this.loadingService.setLoadingStart();

    return this.http.post<WorkflowInstance>(apiUrl, null).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd()),
      tap({
        next: result => {
          this.getUserWorkflows();
          this.getUserWorkflowsTasks();
        }
      })
    )
  }

  returnWorkflow(workflowReturnData: WorkflowReturnData) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowReturnData.workflowInstanceId}/step-returns`;

    this.loadingService.setLoadingStart();

    return this.http.post(apiUrl, workflowReturnData).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd()),
      tap({
        next: result => {
          this.getUserWorkflows();
          this.getUserWorkflowsTasks();
        }
      })
    );

  }

  deleteWorkflow(workflowId: number) {
    const apiUrl = `${environment.pxApiUrl}/workflow-instances/${workflowId}`;

    this.loadingService.setLoadingStart();

    return this.http.delete(apiUrl).pipe(
      take(1),
      finalize(() => this.loadingService.setLoadingEnd()),
      tap({
        next: result => {
          this.getUserWorkflows();
          this.getUserWorkflowsTasks();
        }
      })
    )
  }




}
