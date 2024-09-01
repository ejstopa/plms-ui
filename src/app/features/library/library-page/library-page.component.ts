import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LibraryService } from '../library.service';
import { LibraryDirectoriesListComponent } from '../library-directories-list/library-directories-list.component';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { LibraryToolbarComponent } from '../library-toolbar/library-toolbar.component';


@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [LibraryDirectoriesListComponent, LibraryToolbarComponent],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {
  private libraryService = inject(LibraryService);
  
  activeDirectory = computed(() => this.libraryService.activeDirectory());
}
