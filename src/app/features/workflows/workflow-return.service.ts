import { Attribute, Injectable } from '@angular/core';
import { WorkflowStep } from './workflow-step';
import { WorkflowInstance } from './workflow-instance';
import { WorkflowInstanceValue } from './workflow-instance-value';

@Injectable({
  providedIn: 'root'
})
export class WorkflowReturnService {

  constructor() { }

  getReturnableSteps(steps: WorkflowStep[], values: WorkflowInstanceValue[]) {
    return steps.filter(step => step.itemAttributes.filter(
      attribute => values.find(value => value.itemAttributeId == attribute.id)).length > 0);
  }
  
}
