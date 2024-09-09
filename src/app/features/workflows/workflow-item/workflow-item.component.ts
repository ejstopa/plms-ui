import { Component, input, signal } from '@angular/core';
import { WorkflowInstance } from '../workflow-instance';
import { ItemDescriptorComponent } from '../../../core/Item/item-descriptor/item-descriptor.component';

@Component({
  selector: 'app-workflow-item',
  standalone: true,
  imports: [ItemDescriptorComponent],
  templateUrl: './workflow-item.component.html',
  styleUrl: './workflow-item.component.scss'
})
export class WorkflowItemComponent {
  workflow = input.required<WorkflowInstance>();

  expanded = signal(false);

  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }

}
