import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CreoSessionService } from '../../creo/services/creo-session.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  authService = inject(AuthService);
  creoSessionService = inject(CreoSessionService);

  user = computed(() => this.authService.user());
  isConnectedToCreo = computed(() => this.creoSessionService.isConnected());
  

}
