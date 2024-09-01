import { Component, effect, input, output, signal } from '@angular/core';
import { FileItemComponent } from '../file-item/file-item.component';
import { FileData } from '../file-data';

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [FileItemComponent],
  templateUrl: './files-list.component.html',
  styleUrl: './files-list.component.scss'
})
export class FilesListComponent {
  creoConnected = input.required<boolean>();
  files = input.required<FileData[] | null>();

  openFileClicked = output<FileData>();
  selectedFilesChange = output<FileData[]>();

  selectedFiles = signal<FileData[]>([]);
  onSelectedFilesChange = effect(() => this.selectedFilesChange.emit(this.selectedFiles()));

  addSelectedFile(selectedFile: FileData) {
    this.selectedFiles.update((selectedFiles) => [
        ...selectedFiles,
        this.files()?.find(file => file == selectedFile)!]);
  }

  removeSelectedFile(selectedFile: FileData) {
    this.selectedFiles.update((selectedFiles) => selectedFiles.filter(file => file != selectedFile));
  }

  onOpenFileClicked(file: FileData){
    this.openFileClicked.emit(file);
  }

}
