import { Component, effect, input, output, signal } from '@angular/core';
import { WorkspaceFileModel } from '../workspace-file.model';
import { WorkspaceFileItemComponent } from "../workspace-file-item/workspace-file-item.component";

@Component({
  selector: 'app-workspace-files-list',
  standalone: true,
  imports: [WorkspaceFileItemComponent],
  templateUrl: './workspace-files-list.component.html',
  styleUrl: './workspace-files-list.component.scss'
})
export class WorkspaceFilesListComponent {
  creoConnected = input.required<boolean>();
  files = input.required<WorkspaceFileModel[] | null>();

  openFileClicked = output<WorkspaceFileModel>();
  selectedFilesChange = output<WorkspaceFileModel[]>();

  selectedFiles = signal<WorkspaceFileModel[]>([]);
  onSelectedFilesChange = effect(() => this.selectedFilesChange.emit(this.selectedFiles()));

  addSelectedFile(selectedFile: WorkspaceFileModel) {
    this.selectedFiles.update((selectedFiles) => [
        ...selectedFiles,
        this.files()?.find(file => file == selectedFile)!]);
  }

  removeSelectedFile(selectedFile: WorkspaceFileModel) {
    this.selectedFiles.update((selectedFiles) => selectedFiles.filter(file => file != selectedFile));
  }

  onOpenFileClicked(file: WorkspaceFileModel){
    this.openFileClicked.emit(file);
  }

}
