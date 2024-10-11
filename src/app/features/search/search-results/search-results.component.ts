import { Component, computed, inject } from '@angular/core';
import { SearchService } from '../search.service';
import { ItemListComponent } from '../../../core/Item/item-list/item-list.component';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { ItemDescriptorComponent } from '../../../core/Item/item-descriptor/item-descriptor.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ItemDescriptorComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  creoSessionService = inject(CreoSessionService)
  searchService = inject(SearchService);

  isCreoConnected = computed(() => this.creoSessionService.isConnected());
  searchResultItems = computed(() => this.searchService.searchResults().value);
  searchResultError = computed(() => this.searchService.searchResults().error);
}
