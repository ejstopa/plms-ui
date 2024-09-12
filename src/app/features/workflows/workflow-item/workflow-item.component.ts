import { AfterViewInit, Component, computed, inject, input, signal } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { ItemDescriptorComponent } from '../../../core/Item/item-descriptor/item-descriptor.component';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowStep } from '../workflow-step';
import { WorkflowStepItemComponent } from '../workflow-step-item/workflow-step-item.component';
import { WorkflowInstanceValue } from '../workflow-instance-value';

@Component({
  selector: 'app-workflow-item',
  standalone: true,
  imports: [ItemDescriptorComponent, WorkflowStepItemComponent],
  templateUrl: './workflow-item.component.html',
  styleUrl: './workflow-item.component.scss'
})
export class WorkflowItemComponent implements AfterViewInit{
 
  workflowInstanceService = inject(WorkflowInstanceService);

  workflow = input.required<WorkflowInstance>();
  steps = signal<WorkflowStep[]>([]);
  activeStep = computed(() => this.steps().find(step => step.id == this.workflow().currentStepId));
  workflowValues = signal<WorkflowInstanceValue[]>([]);

  expanded = false;

  ngAfterViewInit(): void {
    this.workflowInstanceService.getWorkflowSteps(this.workflow().id).subscribe(
      {
        next: steps => {
          this.steps.set(steps);
        } 
      }
    );

    this.workflowInstanceService.getWorkflowValues(this.workflow().id).subscribe(
      {
        next: values => this.workflowValues.set(values)
      }
    )
  }
  
  toggleExpanded() {
   this.expanded = !this.expanded;
  }

}
