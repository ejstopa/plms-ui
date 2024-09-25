import { AfterViewInit, Component, computed, effect, inject, input, signal } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { ItemDescriptorComponent } from '../../../core/Item/item-descriptor/item-descriptor.component';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowStep } from '../workflow-step';
import { WorkflowStepItemComponent } from '../workflow-step-item/workflow-step-item.component';
import { WorkflowInstanceValue } from '../workflow-instance-value';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkflowReturnComponent } from "../workflow-return/workflow-return.component";
import { WorkflowReturnData } from '../workflow-return-data';

@Component({
  selector: 'app-workflow-item',
  standalone: true,
  imports: [ItemDescriptorComponent, WorkflowStepItemComponent, WorkflowReturnComponent],
  templateUrl: './workflow-item.component.html',
  styleUrl: './workflow-item.component.scss'
})
export class WorkflowItemComponent {
  authService = inject(AuthService);
  workflowInstanceService = inject(WorkflowInstanceService);

  workflow = input.required<WorkflowInstance>();
  steps = signal<WorkflowStep[]>([]);
  activeStep = computed(() => this.steps().find(step => step.id == this.workflow().currentStepId));
  workflowValues = signal<WorkflowInstanceValue[]>([]);
  isDeletable = computed(() => this.workflow().userId == this.authService.user()?.id);
  isActiveStepReturnable = computed(() => this.steps().findIndex(step => step.id == this.activeStep()?.id) != 0);
  isWorkflowBeingReturned = signal(false);

  expanded = false;

  workflowsChange = effect(() => {
    if (this.workflow()) {
      this.setExpanded(false);
    }
  })

  setExpanded(expanded: boolean) {
    this.expanded = expanded;
  }

  toggleExpanded() {
    if (this.steps().length == 0) {
      this.getStepsAndsValues();
    }
    this.expanded = !this.expanded;
  }

  private getStepsAndsValues() {
    this.workflowInstanceService.getWorkflowSteps(this.workflow().id).subscribe(
      {
        next: steps => this.steps.set(steps)
      }
    );

    this.workflowInstanceService.getWorkflowValues(this.workflow().id).subscribe(
      {
        next: values => this.workflowValues.set(values)
      }
    )
  }

  setWorkflowBeingReturned(isWorkflowBeingReturned: boolean) {
    this.isWorkflowBeingReturned.set(isWorkflowBeingReturned);
  }

  returnWorkflow(workflowReturnData: WorkflowReturnData) {
    this.workflowInstanceService.returnWorkflow(workflowReturnData).subscribe({
      next: result => {
        alert("Workflow devolvido com sucesso");
        this.setWorkflowBeingReturned(false);
        this.toggleExpanded();
      },
      error: error => alert(error.error.detail || "Ocorreu um erro ao tentar devolver o Workflow")
    });
  }

  deleteWorkflow() {
    if (confirm("Deseja realmente excluir o Workflow?")) {
      this.workflowInstanceService.deleteWorkflow(this.workflow().id).subscribe({
        error: error => alert(error.error.detail || "Ocorreu um erro ao tentar excluir o Workflow")
      })
    }
  }

}
