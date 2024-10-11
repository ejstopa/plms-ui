import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { WorkflowInstanceValue } from '../workflow-instance-value';
import { WorkflowReturnService } from '../workflow-return.service';
import { WorkflowStep } from '../workflow-step';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowReturnData } from '../workflow-return-data';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-workflow-return',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './workflow-return.component.html',
  styleUrl: './workflow-return.component.scss'
})
export class WorkflowReturnComponent {
  authService = inject(AuthService);
  workflowReturnService = inject(WorkflowReturnService);

  workflow = input.required<WorkflowInstance>();
  workflowSteps = input.required<WorkflowStep[]>();
  workflowValues = input.required<WorkflowInstanceValue[]>();

  cancelClicked = output();
  confirmClicked = output<WorkflowReturnData>();

  activeStep = computed(() => this.workflowSteps().find(step => step.id == Number(this.workflow().currentStepId)));
  returnableSteps = computed(() =>
    this.workflowSteps() && this.workflowValues() ?
      this.workflowReturnService.getReturnableSteps(this.workflowSteps(), this.workflowValues()) : null);

  selectedStepId = signal<string>("");
  message = signal<string>("");

  onCancelClicked() {
    this.cancelClicked.emit();
  }

  onConfimrClicked() {
    if (!this.selectedStepId() || !this.message()) {
      alert("Todos os campos devem ser preenchidos");
      return;
    }

    const WorkflowReturnData: WorkflowReturnData = {
      workflowInstanceId: this.workflow().id,
      newStepId: Number(this.selectedStepId()),
      message: `Devolvido por ${this.activeStep()?.name} - ${this.message()}`,
      returnedBy: this.authService.user()!.id
    }
    
    this.confirmClicked.emit(WorkflowReturnData);
  }

}
