import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SideBarNavigatonService {
  private activePageToken = "px-active-page";
  private activePageSignal = signal<string>("");

  activePage = computed(() => this.activePageSignal());

  constructor() {
    this.setInitialActivePage();
  }

  setActivePage(activePage: string) {
    this.activePageSignal.set(activePage.toString());
  }

  private setInitialActivePage() {
    this.activePageSignal.set("workspace");
  }
}
