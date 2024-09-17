import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowInstance } from '../workflow-instance';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkflowsListComponent } from '../workflows-list/workflows-list.component';
import { LoadingComponent } from '../../../core/loading/loading.component';
import { WorkflowsPagesService } from '../workflows-pages.service';

@Component({
  selector: 'app-my-workflows',
  standalone: true,
  imports: [LoadingComponent, WorkflowsListComponent],
  templateUrl: './my-workflows.component.html',
  styleUrl: './my-workflows.component.scss',
  host: {class: "d-flex flex-column flex-fill"}
})
export class MyWorkflowsComponent implements OnInit{
  authService = inject(AuthService);
  workflowsPagesService = inject(WorkflowsPagesService);
  workflowInstanceService = inject(WorkflowInstanceService);
  
  workFlows = computed(() => this.workflowInstanceService.userWorkflows());
  workFlowsError = computed(() => this.workflowInstanceService.userWorkflowsError());

  ngOnInit(): void {
    const activePage = this.workflowsPagesService.workflowsPages().find(pages => pages.name == "Meus Workflows")!;
    this.workflowsPagesService.setActivePage(activePage)
    this.workflowInstanceService.getUserWorkflows();
  }



}
