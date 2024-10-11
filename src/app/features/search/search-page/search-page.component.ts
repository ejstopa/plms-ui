import { Component, computed, inject } from '@angular/core';
import { SideBarNavigatonService } from '../../../core/layout/side-bar/side-bar-navigaton.service';
import { RouterOutlet } from '@angular/router';
import { SearchBuilderComponent } from '../search-builder/search-builder.component';
import { ItemFamilyService } from '../../../core/item-families/item-family.service';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { LoadingComponent } from "../../../core/loading/loading.component";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterOutlet, SearchBuilderComponent, SearchResultsComponent, LoadingComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private sideBarNavigatonService = inject(SideBarNavigatonService);

}
