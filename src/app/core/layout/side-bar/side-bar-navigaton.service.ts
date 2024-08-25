import { computed, Injectable, signal } from '@angular/core';

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

  setActivePage(activePage: string){
    this.activePageSignal.set(activePage.toString());
    sessionStorage.setItem("px-active-page", activePage);
  }

  private setInitialActivePage(){
    let activePage = sessionStorage.getItem(this.activePageToken);

    if (activePage == null){
      this.activePageSignal.set("workspace");
      return;
    }

    this.activePageSignal.set(activePage);
  }
}
