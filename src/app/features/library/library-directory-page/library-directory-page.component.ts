import { AfterViewInit, Component, computed, inject, input, Input, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { LibraryService } from '../library.service';
import { ModelService } from '../../../core/model/model.service';
import { Model } from '../../../core/model/model';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpResult } from '../../../core/interfaces/http-result';
import { LoadingComponent } from "../../../core/loading/loading.component";
import { RouterLink } from '@angular/router';
import { FileData } from '../../../core/file/file-data';
import { FilesListComponent } from "../../../core/file/files-list/files-list.component";
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { LibraryToolbarComponent } from "../library-toolbar/library-toolbar.component";
import { AuthService } from '../../../core/auth/auth.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { ItemService } from '../../../core/Item/item.service';
import { ItemRevisionData } from '../../../core/Item/item-revision-data';
import { ItemListComponent } from '../../../core/Item/item-list/item-list.component';
import { Item } from '../../../core/Item/item';

@Component({
  selector: 'app-library-directory-page',
  standalone: true,
  imports: [RouterLink, LoadingComponent, FilesListComponent, LibraryToolbarComponent, ItemListComponent, LoadingComponent],
  templateUrl: './library-directory-page.component.html',
  styleUrl: './library-directory-page.component.scss'
})
export class LibraryDirectoryPageComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private libraryService = inject(LibraryService);
  private itemService = inject(ItemService);
  private creoSessionService = inject(CreoSessionService);

  private itemsResult = signal<HttpResult<Item[]>>({ value: null, error: null });

  directory = computed(() => this.libraryService.activeDirectory());
  items = computed(() => this.itemsResult().value);
  itemsError = computed(() => this.itemsResult().error);
  selectedItems = signal<Item[]>([]);

  @Input()
  directoryName: string = "";
  creoConnected = computed(() => this.creoSessionService.isConnected());

  constructor() { }

  ngAfterViewInit(): void {
    this.libraryService.setActiveDirectory(this.directoryName);
    this.getItems();
  }

  getItems() {
    this.itemService.getItemsByFamily(this.directoryName).subscribe(
      {
        next: itemResult => {
          this.itemsResult.set(itemResult);
        }
      }
    );
  }

  setSelectedItems(items: Item[]) {
    this.selectedItems.set(items)
  }

  openSelectedItems() {
    if (!this.creoConnected()) {
      return;
    }

    if (this.selectedItems().length == 0) {
      alert("Nenhum item selecionado");
      return;
    }

    let filePaths = this.selectedItems().flatMap(item => item.models.map(model => model.filePath));
    this.creoSessionService.openCreoFiles(filePaths);
  }

  CheckoutSelectedModels() {
    if (this.selectedItems().length == 0) {
      alert("Nenhum item selecionado");
      return;
    }

    let itemsRevisionData: ItemRevisionData[] = this.selectedItems().map(item => { return { itemId: item.id, itemName: item.name, userId: this.authService.user()!.id } });

    this.itemService.CheckoutItems(itemsRevisionData)?.subscribe({
      complete: () => this.getItems()
    });
  }


}
