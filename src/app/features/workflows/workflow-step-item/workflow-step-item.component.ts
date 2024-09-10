import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { WorkflowStep } from '../workflow-step';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { group } from '@angular/animations';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-workflow-step-item',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './workflow-step-item.component.html',
  styleUrl: './workflow-step-item.component.scss'
})
export class WorkflowStepItemComponent {
  authService = inject(AuthService);

  step = input.required<WorkflowStep>();
  workFlowUserId = input.required<number>();
  active = input.required<boolean>();
  
  user = computed(() => this.authService.user());

  enabled = computed(() => {
    if (this.step() && this.user()){
      if(!this.active()){
        return false;
      }

      if (!this.user()!.userRole.departments.map(department => department.id).includes(this.step().departmentId)){
        return false;
      }

      if (this.step().isUserExclusive && this.user()!.id != this.workFlowUserId()){
        return false;
      }

      return true;
    }

    return false;
  });
  expanded = signal(false);
  stepForm = new FormGroup({});

  onStepLoaded = effect(() => {
    for (let attribute of this.step().itemAttributes){
      this.stepForm.addControl(attribute.name, new FormControl("", [Validators.required]));
    }
  });


  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }

  onFormSubmit(){
    if (this.stepForm.invalid){
      alert("form invalid");
      return;
    }
   
    
  }

  

  

}
