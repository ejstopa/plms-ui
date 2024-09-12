import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideBarNavigatonService } from './side-bar-navigaton.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  private authService = inject(AuthService);
  private sideBarNavigatonService = inject(SideBarNavigatonService);

  expanded = signal(true);
  activePage = computed(() => this.sideBarNavigatonService.activePage());

  toggleExpanded(){
    this.expanded.set(!this.expanded());
  }

  setActivePage(activePage: string){
    this.sideBarNavigatonService.setActivePage(activePage);
  }
}
