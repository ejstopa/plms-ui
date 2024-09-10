import { Component, computed, inject, input, signal } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { ItemDescriptorComponent } from '../../../core/Item/item-descriptor/item-descriptor.component';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowStep } from '../workflow-step';
import { WorkflowStepItemComponent } from '../workflow-step-item/workflow-step-item.component';

@Component({
  selector: 'app-workflow-item',
  standalone: true,
  imports: [ItemDescriptorComponent, WorkflowStepItemComponent],
  templateUrl: './workflow-item.component.html',
  styleUrl: './workflow-item.component.scss'
})
export class WorkflowItemComponent {
  workflowInstanceService = inject(WorkflowInstanceService);

  workflow = input.required<WorkflowInstance>();
  steps = signal<WorkflowStep[]>([]);
  activeStep = computed(() => this.steps().find(step => step.id = this.workflow().currentStepId))

  expanded = signal(false);

  toggleExpanded() {

    if (!this.expanded() && this.steps().length == 0){
      this.workflowInstanceService.getWorkflowSteps(this.workflow().id).subscribe(
        {
          next: steps => {
            this.steps.set(steps);
          } 
        }
      );
    }

    this.expanded.set(!this.expanded());
  }

}
