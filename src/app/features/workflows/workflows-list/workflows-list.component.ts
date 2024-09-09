import { Component, input } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { WorkflowItemComponent } from '../workflow-item/workflow-item.component';

@Component({
  selector: 'app-workflows-list',
  standalone: true,
  imports: [WorkflowItemComponent],
  templateUrl: './workflows-list.component.html',
  styleUrl: './workflows-list.component.scss'
})
export class WorkflowsListComponent {
  workFlows= input.required<WorkflowInstance[]>();
}
