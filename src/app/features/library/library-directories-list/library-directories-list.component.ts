import { Component, computed, inject, input, OnInit } from '@angular/core';
import { LibraryDirectoryItemComponent } from '../library-directory-item/library-directory-item.component';
import { Router } from '@angular/router';
import { ItemFamilyService } from '../../../core/item-families/item-family.service';

@Component({
  selector: 'app-library-directories-list',
  standalone: true,
  imports: [LibraryDirectoryItemComponent],
  templateUrl: './library-directories-list.component.html',
  styleUrl: './library-directories-list.component.scss'
})
export class LibraryDirectoriesListComponent implements OnInit{
  private router = inject(Router);
  private itemFamilyService = inject(ItemFamilyService);

  itemFamilies = computed(()=> this.itemFamilyService.itemFamilies());

  ngOnInit(): void {
    this.itemFamilyService.setActiveItemFamily(null);
  }
 
}
