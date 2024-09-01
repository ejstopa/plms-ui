import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-library-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './library-toolbar.component.html',
  styleUrl: './library-toolbar.component.scss'
})
export class LibraryToolbarComponent {
  creoConnected = input.required();
  
  openFileClicked = output();
  newRevisionClicked = output();

  onOpenFileClicked() {
    this.openFileClicked.emit();
  }

onNewRevisionClicked(){
  this.newRevisionClicked.emit();
}

  

}
