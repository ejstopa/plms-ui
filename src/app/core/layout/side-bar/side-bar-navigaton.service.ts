import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarNavigatonService {
  private activePageToken = "px-active-page"
  private activePageSignal = signal<string>("");

  activePage = computed(() => this.activePageSignal());

  constructor() {
    this.setInitialActivePage();
  }

  setActivePage(activePage: string) {
    sessionStorage.setItem(this.activePageToken, activePage);
    this.activePageSignal.set(activePage.toString());
  }

  private setInitialActivePage() {
    const activePageToken = sessionStorage.getItem(this.activePageToken);

    if (activePageToken) {
      this.activePageSignal.set(activePageToken);
      return;
    }

    this.activePageSignal.set("workspace");
  }
}
