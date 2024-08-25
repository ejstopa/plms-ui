import { Component, computed, inject, input, OnInit } from '@angular/core';
import { LibraryDirectoryItemComponent } from '../library-directory-item/library-directory-item.component';
import { LibraryService } from '../library.service';
import { LibraryDirectoryModel } from '../library-directory.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-directories-list',
  standalone: true,
  imports: [LibraryDirectoryItemComponent],
  templateUrl: './library-directories-list.component.html',
  styleUrl: './library-directories-list.component.scss'
})
export class LibraryDirectoriesListComponent implements OnInit{
  private router = inject(Router);
  private libraryService = inject(LibraryService);

  directories = computed(() => this.libraryService.directories());

  ngOnInit(): void {
    this.libraryService.setActiveDirectory(null);
  }
 
}
