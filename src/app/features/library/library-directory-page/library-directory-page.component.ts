import { AfterViewInit, Component, computed, inject, input, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { LibraryService } from '../library.service';
import { LibraryDirectoryModel } from '../library-directory.model';

@Component({
  selector: 'app-library-directory-page',
  standalone: true,
  imports: [],
  templateUrl: './library-directory-page.component.html',
  styleUrl: './library-directory-page.component.scss'
})
export class LibraryDirectoryPageComponent implements AfterViewInit {
  libraryService = inject(LibraryService);
  directory = computed(() => this.libraryService.activeDirectory())
 
  @Input()
  directoryName: string = "";

  constructor(){}

  ngAfterViewInit(): void {
    this.libraryService.setActiveDirectory(this.directoryName);
  }


}
