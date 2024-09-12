import { Component, computed, inject } from '@angular/core';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkflowsListComponent } from "../workflows-list/workflows-list.component";
import { LoadingComponent } from "../../../core/loading/loading.component";

@Component({
  selector: 'app-my-workflow-tasks',
  standalone: true,
  imports: [WorkflowsListComponent, LoadingComponent],
  templateUrl: './my-workflow-tasks.component.html',
  styleUrl: './my-workflow-tasks.component.scss'
})
export class MyWorkflowTasksComponent {
  authService = inject(AuthService);
  workflowInstanceService = inject(WorkflowInstanceService);
  
  workFlows = computed(() => this.workflowInstanceService.userWorkflowsTasks());
  workFlowsError = computed(() => this.workflowInstanceService.userWorkflowsTasksError());

  ngOnInit(): void {
    this.workflowInstanceService.getUserWorkflowsTasks();
  }
}
