import { Component, effect, input, output, signal, viewChildren } from '@angular/core';
import { Item } from '../item';
import { ItemDescriptorComponent } from '../item-descriptor/item-descriptor.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [ItemDescriptorComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  creoConnected = input.required<boolean>();
  items = input.required<Item[] | null>();
  allowItemReleases = input(false);
  
  selectedItemsChanged = output<Item[]>();

  selectedItems = signal<Item[]>([]);
  itemDescriptors = viewChildren(ItemDescriptorComponent);
  onSelectedItemsChanged = effect(() => this.selectedItemsChanged.emit(this.selectedItems()));

  addSelectedItem(selectedItem: Item) {
    this.selectedItems.update((items) => [...items, selectedItem]);
  }

  removeSelectedItem(unselectedItem: Item) {
    this.selectedItems.update((items) => items.filter(item => item != unselectedItem))
  }

  onSelectClicked(event: Event){
    if ((event.target as HTMLInputElement).checked){
      this.selectAllItems();
    }
    else{
      this.unselectAllItems();
    }
  }

  selectAllItems() {
    this.selectedItems.set(this.items()!);
  }

  unselectAllItems() {
    this.selectedItems.set([]);
  }

  expandAllItems(){
    this.itemDescriptors().forEach(itemDescriptor => itemDescriptor.expandItem());
  }

  collapseAllItems(){
    this.itemDescriptors().forEach(itemDescriptor => itemDescriptor.collapseItem());
  }

 


}
