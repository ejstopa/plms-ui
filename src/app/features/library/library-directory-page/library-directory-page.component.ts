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

@Component({
  selector: 'app-library-directory-page',
  standalone: true,
  imports: [RouterLink, LoadingComponent, FilesListComponent, LibraryToolbarComponent, LoadingComponent],
  templateUrl: './library-directory-page.component.html',
  styleUrl: './library-directory-page.component.scss'
})
export class LibraryDirectoryPageComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private libraryService = inject(LibraryService);
  private modelService = inject(ModelService);
  private itemService = inject(ItemService);
  private creoSessionService = inject(CreoSessionService);

  private modelsResult = signal<HttpResult<Model[]>>({ value: null, error: null });
  private fileExtensions = [".prt", ".asm", ".drw"];

  directory = computed(() => this.libraryService.activeDirectory());
  models = computed(() => this.modelsResult().value);
  modelsError = computed(() => this.modelsResult().error);
  selectedFiles = signal<FileData[]>([]);

  files = computed(() => this.models() ?
    this.models()!.map(model => ({
      name: model.name,
      extension: model.type,
      fullPath: model.filePath,
      lastModifiedAt: model.createdAt,
      status: model.checkedOutBy ? 'checkedOut' : 'released',
      revision: model.revision
    }) as FileData) : null);

  @Input()
  directoryName: string = "";
  creoConnected = computed(() => this.creoSessionService.isConnected());

  constructor() { }

  ngAfterViewInit(): void {
    this.libraryService.setActiveDirectory(this.directoryName);
    this.getModels();
  }

  getModels() {
    this.modelService.getModelsByFamily(this.directoryName).subscribe(
      {
        next: models => {
          this.modelsResult.set(models);
        }
      }
    );
  }

  setSelectedFiles(files: FileData[]) {
    this.selectedFiles.set(files);
  }

  openFile(file: FileData) {
    if (this.creoConnected()) {
      this.creoSessionService.openCreoFiles([file.fullPath]);
    }
  }

  openSelectedFiles() {
    if (!this.creoConnected()) {
      return;
    }

    if (this.selectedFiles().length == 0) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    let filePaths = this.selectedFiles().map(file => file.fullPath);
    this.creoSessionService.openCreoFiles(filePaths);
  }

  CheckoutSelectedModels() {
    if (this.selectedFiles().length == 0) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    let selectedModels: Model[] = this.models()?.filter(model => 
      this.selectedFiles().some(file => file.name == model.name)) || [];
    
    let selectedModelsDistinct: Model[] = selectedModels.filter((model, i, array) => 
      array.findIndex(t => t.itemId == model.itemId) == i);
    
    let itemsRevisionData: ItemRevisionData[] = selectedModelsDistinct.map(model=> 
      {return {itemId: model.itemId, userId: this.authService.user()!.id, selectedModelName: model.name }});

    this.itemService.CheckoutItems(itemsRevisionData)?.subscribe({
      complete: () => this.getModels()
    });
  }


}
