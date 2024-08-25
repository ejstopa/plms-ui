import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSignal = signal<boolean>(false);
  isLoading = computed(() => this.isLoadingSignal());

  constructor() { }

  setLoadingStart(){
    this.isLoadingSignal.set(true);
  }

  setLoadingEnd(){
    this.isLoadingSignal.set(false);
  }
}
