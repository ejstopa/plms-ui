import { Component, computed, input, output, signal } from '@angular/core';
import { FileData } from '../file-data';

@Component({
  selector: 'app-file-item',
  standalone: true,
  imports: [],
  templateUrl: './file-item.component.html',
  styleUrl: './file-item.component.scss'
})
export class FileItemComponent {
  file = input.required<FileData>();
  creConnected = input.required<boolean>();

  selected = output<FileData>();
  unselected = output<FileData>();
  openClicked = output<FileData>();

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


  private getFileIconImgPath(file: FileData) {
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

  private getFileStatusImgPath(file: FileData): string{
    let statusImgPath = "";

    switch (file.status) {
      case "newItem":
        statusImgPath = "images/new.png";
        break;
      case "checkedOut":
        statusImgPath = "images/checkout_revise.png";
        break;
      case "released":
        statusImgPath = "images/completed.png";
        break;
    }
    return statusImgPath;
  }
}
