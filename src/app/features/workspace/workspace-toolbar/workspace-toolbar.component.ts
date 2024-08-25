import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-workspace-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './workspace-toolbar.component.html',
  styleUrl: './workspace-toolbar.component.scss'
})
export class WorkspaceToolbarComponent {
  creoConnected = input.required();

  newFileClicked = output();
  openFileClicked = output();
  deleteFileClicked = output();

  onNewFileClicked() {
    this.newFileClicked.emit();
  }

  onOpenFileClicked() {
    this.openFileClicked.emit();
  }

  onDeleteFileClicked(){
    this.deleteFileClicked.emit();
  }


}
