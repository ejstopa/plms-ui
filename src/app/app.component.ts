import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {

  title = 'plms-ui';


  @HostListener('window:beforeunload')
  async ngOnDestroy()
  {
    // await console.log("browser will be closed");
  }


}
