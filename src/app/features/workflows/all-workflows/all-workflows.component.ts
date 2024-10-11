import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { WorkflowsPagesService } from '../workflows-pages.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowsListComponent } from "../workflows-list/workflows-list.component";
import { LoadingComponent } from "../../../core/loading/loading.component";
import { WorkflowInstance } from '../workflow-instance';
import { HttpError } from '../../../core/interfaces/http-error';

@Component({
  selector: 'app-all-workflows',
  standalone: true,
  imports: [WorkflowsListComponent, LoadingComponent],
  templateUrl: './all-workflows.component.html',
  styleUrl: './all-workflows.component.scss',
  host: { class: "d-flex flex-column flex-fill" }
})
export class AllWorkflowsComponent implements OnInit {
  workflowsPagesService = inject(WorkflowsPagesService);

  authService = inject(AuthService);
  workflowInstanceService = inject(WorkflowInstanceService);

  workFlows = computed(() => this.workflowInstanceService.allworkflows());
  workFlowsError = computed(() => this.workflowInstanceService.allworkflowsError());

  ngOnInit(): void {
    const activePage = this.workflowsPagesService.workflowsPages().find(pages => pages.name == "Todos Workflows")!;
    this.workflowsPagesService.setActivePage(activePage);

    this.workflowInstanceService.getAllWorkFlows();
  }

}
