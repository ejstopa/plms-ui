import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ItemFamily } from '../../../core/item-families/item-family';
import { ItemFamilyService } from '../../../core/item-families/item-family.service';
import { ItemAttribute } from '../../../core/Item/item-attribute';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchOperators } from '../search-operators';
import { SearchParam } from '../search-param';
import { SearchData } from '../search-data';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-builder',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search-builder.component.html',
  styleUrl: './search-builder.component.scss'

})
export class SearchBuilderComponent {
  itemFamilyService = inject(ItemFamilyService);
  searchService = inject(SearchService);

  itemFamilies = computed(() => this.itemFamilyService.itemFamilies());
  activeItemFamily = signal<ItemFamily | null>(null);
  activeFamilyAttributes = signal<ItemAttribute[]>([]);
  activeFamilyAttributesChange = effect(() => {
    if (this.activeFamilyAttributes()) {
      this.clearAttributesForm();
      this.buildAttributesForm();
    }
  });

  attributesForm = new FormGroup({});

  onActiveFamilyChange(event: Event) {
    const itemFamilyId = Number((event.target as HTMLSelectElement).value);

    if (!itemFamilyId) {
      return;
    }
    
    this.searchService.clearSearchResults();
    this.setActiveItemFamily(itemFamilyId);
    this.getItemFamilyAttributes(itemFamilyId);
  }

  onSearchClicked() {
    if (!this.activeItemFamily()) {
      return;
    }

    let searchData = this.buildSearchData();

    this.searchService.executeSearch(searchData);
  }

  private getItemFamilyAttributes(itemFamilyId: number) {
    this.itemFamilyService.getItemFamilyAttributes(itemFamilyId).subscribe({
      next: attributes => this.activeFamilyAttributes.set(attributes),
      error: error => alert("Ocorreu um erro ao carregar os atributos da família")
    })
  }

  private setActiveItemFamily(itemFamilyId: number) {
    this.activeItemFamily.set(this.itemFamilies()?.find(family => family.id == itemFamilyId) || null);
  }

  private clearAttributesForm() {
    if (this.activeFamilyAttributes()) {
      Object.keys(this.attributesForm.controls).forEach(controlName => this.attributesForm.removeControl(controlName));
    }
  }

  private buildAttributesForm() {
    for (let attribute of this.activeFamilyAttributes()) {
      this.attributesForm.addControl(attribute.id.toString(), new FormGroup({}));
      (this.attributesForm.get(attribute.id.toString()) as FormGroup)
        .addControl(`operator`, new FormControl("="));
      (this.attributesForm.get(attribute.id.toString()) as FormGroup)
        .addControl(`value`, new FormControl());
    }
  }

  private buildSearchData(): SearchData {
    let searchParams: SearchParam[] = [];

    for (let key of Object.keys(this.attributesForm.controls)) {
      let attribute = this.activeFamilyAttributes().find(attribute => attribute.id == Number(key));

      if (this.attributesForm.get(key)?.get("value")?.value) {
        searchParams.push({
          itemAttributeId: Number(key),
          operator: this.attributesForm.get(key)?.get("operator")?.value,

          valueString: attribute?.type != "typeNumber" ?
            this.attributesForm.get(key)?.get("value")?.value : "",

          valueNumber: attribute?.type == "typeNumber" ?
            Number(this.attributesForm.get(key)?.get("value")?.value) : 0,
        } as SearchParam);
      }
    }

    let searchData: SearchData = {
      itemFamilyId: this.activeItemFamily()!.id,
      searchParams: searchParams
    }

    return searchData;
  }

}
