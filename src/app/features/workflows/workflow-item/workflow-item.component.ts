import { Component, input } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';

@Component({
  selector: 'app-workflow-item',
  standalone: true,
  imports: [],
  templateUrl: './workflow-item.component.html',
  styleUrl: './workflow-item.component.scss'
})
export class WorkflowItemComponent {
  workflowInstance = input.required<WorkflowInstance>();
}
