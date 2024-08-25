import { Component, computed, input, output, signal } from '@angular/core';
import { WorkspaceFileModel } from '../workspace-file.model';

@Component({
  selector: 'app-workspace-file-item',
  standalone: true,
  imports: [],
  templateUrl: './workspace-file-item.component.html',
  styleUrl: './workspace-file-item.component.scss'
})
export class WorkspaceFileItemComponent {
  file = input.required<WorkspaceFileModel>();
  creConnected = input.required<boolean>();

  selected = output<WorkspaceFileModel>();
  unselected = output<WorkspaceFileModel>();
  openClicked = output<WorkspaceFileModel>();

  fileIconImgPath = computed(() => this.getFileIconImgPath(this.file()));
  fileStatusImgPath = computed(() => this.getFileStatusImgPath(this.file()));
  checked = signal<boolean>(false);


  onCheckBoxChange(){
    this.checked.update((checked) => !checked);

    if (this.checked()){
      this.onSelected();
    }
    else{
      this.onUnselected();
    }
  }

  onSelected(){
    this.selected.emit(this.file());
  }

  onUnselected(){
    this.unselected.emit(this.file());
  }

  onOpenClicked(){
    if (this.creConnected()){
      this.openClicked.emit(this.file());
    }
  }


  private getFileIconImgPath(file: WorkspaceFileModel) {
    let fileImgPath = "";

    switch (file.extension) {
      case ".prt":
        fileImgPath = "images/prt_image.png";
        break;
      case ".asm":
        fileImgPath = "images/asm_image.png";
        break;
      case ".drw":
        fileImgPath = "images/drawing.png";
        break;
    }
    return fileImgPath;
  }

  private getFileStatusImgPath(file: WorkspaceFileModel): string{
    return file.isRevision? "images/checkout_revise.png" : "images/new.png"
  }
}
