import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarNavigatonService {
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
