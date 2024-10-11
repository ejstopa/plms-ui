import { Component, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkflowReturnRejectionData } from '../workflow-return-rejection-data';

@Component({
  selector: 'app-workflow-return-rejection',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './workflow-return-rejection.component.html',
  styleUrl: './workflow-return-rejection.component.scss'
})
export class WorkflowReturnRejectionComponent {
  userId = input.required<number>();
  workflowId = input.required<number>();

  message = signal<string>("");

  cancelClicked = output();
  confirmClicked = output<WorkflowReturnRejectionData>();

  onCancelClicked() {
    this.cancelClicked.emit();
  }

  onConfimrClicked() {
    if (!this.message()) {
      alert("O campo mensagem deve ser ser preenchido");
      return;
    }

    const rejectionData: WorkflowReturnRejectionData = {
      userId: this.userId(),
      workflowInstanceId: this.workflowId(),
      message: `Devolução Recusada - ${this.message()}` 
    }

    this.confirmClicked.emit(rejectionData);
  }

}
