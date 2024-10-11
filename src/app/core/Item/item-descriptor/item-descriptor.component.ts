import { Component, computed, effect, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { Item } from '../item';
import { ModelDescriptorComponent } from '../../model/model-descriptor/model-descriptor.component';
import { Model } from '../../model/model';
import { ItemStatus } from '../item-status';
import { CreoSessionService } from '../../creo/services/creo-session.service';
import { WorkflowInstanceService } from '../../../features/workflows/workflow-instance.service';

@Component({
  selector: 'app-item-descriptor',
  standalone: true,
  imports: [ModelDescriptorComponent],
  templateUrl: './item-descriptor.component.html',
  styleUrl: './item-descriptor.component.scss'
})
export class ItemDescriptorComponent {
  creoSessionService = inject(CreoSessionService);
  workflowInstanceService = inject(WorkflowInstanceService);
  item = input.required<Item>();
  allowItemReleases = input(false);
  allowSelection = input(true);

  selectClicked = output<Item>();
  unselectClicked = output<Item>();
  releaseItemClicked = output<Item>();

  creoConnected = computed(() => this.creoSessionService.isConnected());
  itemStatusImgPath = computed(() => this.getItemStatusImgPath(this.item()));
  expanded = signal(false);
  selected = input.required<boolean>();
  selectedChanged = effect(() => {
    if (this.allowSelection()) {
      ((this.selectCheckbox()?.nativeElement) as HTMLInputElement).checked = this.selected();
    }
  });
  selectCheckbox = viewChild<ElementRef>("selectCheckbox");

  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }

  expandItem() {
    this.expanded.set(true);
  }

  collapseItem() {
    this.expanded.set(false);
  }

  openModel(model: Model) {
    if (this.creoConnected()) {
      this.creoSessionService.openCreoFiles([model.filePath]);
    }
  }

  onSelectChange() {
    if (!this.selected()) {
      this.onSelect()
    }
    else {
      this.onUnselect();
    }
  }

  onReleaseItemClicked() {
    if (!confirm("Deseja realmente liberar o item?")) {
      return;
    }

    this.releaseItemClicked.emit(this.item());
  }

  private onSelect() {
    this.selectClicked.emit(this.item());
  }

  private onUnselect() {
    this.unselectClicked.emit(this.item());
  }

  private getItemStatusImgPath(item: Item): string {
    let statusImgPath = "";

    switch (item.status) {
      case ItemStatus[ItemStatus.newItem]:
        statusImgPath = "images/new.png";
        break;
      case ItemStatus[ItemStatus.checkedOut]:
        statusImgPath = "images/checkout_revise.png";
        break;
      case ItemStatus[ItemStatus.released]:
        statusImgPath = "images/released.png";
        break;
      case ItemStatus[ItemStatus.inWorkflow]:
        statusImgPath = "images/in-workflow.png"
        break;
    }
    return statusImgPath;
  }
}
