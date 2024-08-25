import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LibraryService } from '../library.service';


@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {
  private libraryService = inject(LibraryService);

  activeDirectory = computed(() => this.libraryService.activeDirectory());
}
