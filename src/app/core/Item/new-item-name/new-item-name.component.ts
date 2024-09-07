import { Component, computed, inject, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemFamilyService } from '../../item-families/item-family.service';

@Component({
  selector: 'app-new-item-name',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './new-item-name.component.html',
  styleUrl: './new-item-name.component.scss'
})
export class NewItemNameComponent {
  itemFamilyService = inject(ItemFamilyService);

  createIemNameClicked = output<string>();
  cancelClicked = output();

  families = computed(()=> this.itemFamilyService.itemFamilies());
  selectedFamily = "0001";

  onCreateIemNameClicked(){
    this.createIemNameClicked.emit(this.selectedFamily);
  }

  onCancelClicked(){
    this.cancelClicked.emit();
  }

}
