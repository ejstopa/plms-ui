import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LibraryDirectoriesListComponent } from '../library-directories-list/library-directories-list.component';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { LibraryToolbarComponent } from '../library-toolbar/library-toolbar.component';
import { ItemFamilyService } from '../../../core/item-families/item-family.service';


@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [LibraryDirectoriesListComponent, LibraryToolbarComponent],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {
  private itemFamilyService = inject(ItemFamilyService);
  
  activeItemFamily = computed(() => this.itemFamilyService.activeItemFamily());
}
