import { Component, computed, effect, Inject, inject, input, signal } from '@angular/core';
import { WorkflowStep } from '../workflow-step';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { group } from '@angular/animations';
import { AuthService } from '../../../core/auth/auth.service';
import { CreateWorkflowValueDto } from '../create-workflow-value-dto';
import { WorkflowInstanceService } from '../workflow-instance.service';
import { WorkflowInstanceValue } from '../workflow-instance-value';
import { ItemAttributeTypes } from '../../../core/Item/item-attribute-types';
import { ItemService } from '../../../core/Item/item.service';

@Component({
  selector: 'app-workflow-step-item',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './workflow-step-item.component.html',
  styleUrl: './workflow-step-item.component.scss'
})
export class WorkflowStepItemComponent {
  authService = inject(AuthService);
  workflowInstanceService = inject(WorkflowInstanceService);
  itemService = inject(ItemService);

  step = input.required<WorkflowStep>();
  workflowValues = input.required<WorkflowInstanceValue[]>();
  workFlowUserId = input.required<number>();
  workflowInstanceId = input.required<number>();
  active = input.required<boolean>();
  isLastStep = input.required<boolean>();

  user = computed(() => this.authService.user());
  stepValues = computed(() => this.workflowValues().filter(value => this.step().itemAttributes.map(attribute => attribute.id).includes(value.itemAttributeId)));

  enabled = computed(() => {
    if (this.step() && this.user()) {
      if (!this.active()) {
        return false;
      }

      if (!this.user()!.userRole.departments.map(department => department.id).includes(this.step().departmentId)) {
        return false;
      }

      if (this.step().isUserExclusive && this.user()!.id != this.workFlowUserId()) {
        return false;
      }

      return true;
    }

    return false;
  });
  expanded = signal(false);
  stepForm = new FormGroup({});

  onStepLoaded = effect(() => {
    for (let attribute of this.step().itemAttributes) {
      let attibuteValue = this.stepValues().find(value => value.itemAttributeId == attribute.id);
      let value = attribute.type == ItemAttributeTypes[ItemAttributeTypes.typeNumber]? 
      attibuteValue?.itemAttributeValueNumber : 
      attibuteValue?.itemAttributeValueString;

      this.stepForm.addControl(attribute.id.toString(), new FormControl(value, [Validators.required]));
    }
  });

  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }

  onFormSubmit() {
    if (this.stepForm.invalid) {
      alert("form invalid");
      return;
    }

    let workflowValues: CreateWorkflowValueDto[] = [];
    let controlNames = Object.keys(this.stepForm.controls);

    for (let name of controlNames) {
      let formControl = this.stepForm.get(name);

      workflowValues.push({
        workflowInstanceId: this.workflowInstanceId(),
        itemAttributeId: Number(name),
        itemAttributeName: this.step().itemAttributes.find(attribute => attribute.id == Number(name))!.name,
        value: (formControl?.value).toString()
      });
    }

    this.workflowInstanceService.createWorkflowValue(this.workflowInstanceId(), workflowValues).subscribe(
      {
        next: result => {
          this.workflowInstanceService.finalizeStep(this.workflowInstanceId()).subscribe(
            {
              next: result => {
                alert("Etapa finalizada com sucesso");
                
                if (this.isLastStep()){
                  this.itemService.createItem(result.id).subscribe({
                      next: result => alert("Workflow finalizado"),
                      error : error => alert("Ocorreu um erro ao finalizar o workflow")}
                  )
                }
                this.toggleExpanded();
              }
            }
          );
        }
      }
    );



  }






}
