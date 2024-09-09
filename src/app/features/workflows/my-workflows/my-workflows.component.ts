import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowInstance } from '../workflow-instance';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkflowsListComponent } from '../workflows-list/workflows-list.component';
import { LoadingComponent } from '../../../core/loading/loading.component';

@Component({
  selector: 'app-my-workflows',
  standalone: true,
  imports: [LoadingComponent, WorkflowsListComponent],
  templateUrl: './my-workflows.component.html',
  styleUrl: './my-workflows.component.scss'
})
export class MyWorkflowsComponent implements OnInit{
  authService = inject(AuthService);
  workflowInstanceService = inject(WorkflowInstanceService);
  
  workFlows = computed(() => this.workflowInstanceService.userWorkflows());
  workFlowsError = computed(() => this.workflowInstanceService.userWorkflowsError());

  ngOnInit(): void {
    this.workflowInstanceService.getUserWorkflows();
  }



}
