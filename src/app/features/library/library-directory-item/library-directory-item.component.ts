import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemFamily } from '../../../core/item-families/item-family';


@Component({
  selector: 'app-library-directory-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './library-directory-item.component.html',
  styleUrl: './library-directory-item.component.scss'
})
export class LibraryDirectoryItemComponent {
  itemFamily = input.required<ItemFamily>();

}
