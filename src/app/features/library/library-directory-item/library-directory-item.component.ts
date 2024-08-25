import { Component, inject, input, output } from '@angular/core';
import { LibraryDirectoryModel } from '../library-directory.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-library-directory-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './library-directory-item.component.html',
  styleUrl: './library-directory-item.component.scss'
})
export class LibraryDirectoryItemComponent {
  directory = input.required<LibraryDirectoryModel>();

}
