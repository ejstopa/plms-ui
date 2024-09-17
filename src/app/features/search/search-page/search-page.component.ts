import { Component, inject } from '@angular/core';
import { SideBarNavigatonService } from '../../../core/layout/side-bar/side-bar-navigaton.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private sideBarNavigatonService = inject(SideBarNavigatonService);

  ngOnInit(): void {
    this.sideBarNavigatonService.setActivePage("search");
  }

}
