import { Component, computed, inject } from '@angular/core';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { SideBarComponent } from '../../../core/layout/side-bar/side-bar.component';
import { TopBarComponent } from "../../../core/layout/top-bar/top-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, TopBarComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  private creoSessionService = inject(CreoSessionService);

  isConnectedToCreo = computed(() => this.creoSessionService.isConnected());
  
}
