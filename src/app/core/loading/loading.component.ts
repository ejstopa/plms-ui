import { Component, computed, inject } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  private loadingService = inject(LoadingService);
  isLoading = computed(() => this.loadingService.isLoading());
}
