import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkspaceService } from '../workspace.service';
import { FilesListComponent } from "../../../core/file/files-list/files-list.component";
import { LoadingComponent } from '../../../core/loading/loading.component';
import { WorkspaceToolbarComponent } from '../workspace-toolbar/workspace-toolbar.component';
import { FileData } from '../../../core/file/file-data';
import { FileService } from '../../../core/file/file.service';
import { FileStatus } from '../../../core/file/file-status';
import { ItemService } from '../../../core/Item/item.service';
import { ItemRevisionData } from '../../../core/Item/item-revision-data';
import { ItemListComponent } from '../../../core/Item/item-list/item-list.component';
import { Item } from '../../../core/Item/item';
import { Model } from '../../../core/model/model';
import { NewItemNameComponent } from '../../../core/Item/new-item-name/new-item-name.component';
import { ItemNameService } from '../../../core/Item/item-name.service';
import { CreateItemNameDto } from '../../../core/Item/create_item_name_dto';
import { ItemNameReservation } from '../../../core/Item/item-name-reservation';
import { WorkflowInstanceService } from '../../workflows/workflow-instance.service';
import { SideBarNavigatonService } from '../../../core/layout/side-bar/side-bar-navigaton.service';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [ItemListComponent, WorkspaceToolbarComponent, LoadingComponent, NewItemNameComponent],
  templateUrl: './workspace-page.component.html',
  styleUrl: './workspace-page.component.scss'
})
export class WorkspacePageComponent implements OnInit {

  // @HostListener('document:visibilitychange', ['$event'])
  // appVisibility() {
  //   alert("event");
  //   if (!document.hidden) {
  //     this.workspaceService.getWorkspaceFiles();
  //     alert("show");
  //   }
  // }

  private authService = inject(AuthService);
  private creoSessionService = inject(CreoSessionService);
  private sideBarNavigatonService = inject(SideBarNavigatonService);
  private workspaceService = inject(WorkspaceService);
  private itemService = inject(ItemService);
  private itemNameService = inject(ItemNameService);
  private workflowInstanceService = inject(WorkflowInstanceService);

  creoConnected = computed(() => this.creoSessionService.isConnected());
  user = computed(() => this.authService.user());
  workspaceItems = computed(() => this.workspaceService.workspaceFiles(),)
  workspaceError = computed(() => this.workspaceService.workspaceFilesError());
  
  selectedItems = signal<Item[]>([]);
  displayNewItemNameComponent = signal(false);
  isNewFileBeingCreated = signal(false);

  ngOnInit(): void {
    this.sideBarNavigatonService.setActivePage("workspace");
    this.workspaceService.getWorkspaceFiles();
  }

  setSelectedItems(items: Item[]) {
    this.selectedItems.set(items);
  }

  openSelectedItems() {
    if (!this.creoConnected()) {
      return;
    }

    if (this.selectedItems().length == 0) {
      alert("Nenhum item selecionado");
      return;
    }

    let filePaths = this.selectedItems().flatMap(item => item.models.map(model => model.filePath));;
    this.creoSessionService.openCreoFiles(filePaths);
  }

  realeaseItem(item: Item) {
    if (item.family) {
      this.workflowInstanceService.createWorkflowInstance(item.name).subscribe(
        {
          next: result => {
            alert("Item enviado para o fluxo de liberação com sucesso");
            this.workspaceService.getWorkspaceFiles();
          },
          error: error => alert(error.error.detail || "Ocorreu um erro ao tentar liberar o item")
        }
      )
    }
  }

  startNewFileCreation() {
    this.isNewFileBeingCreated.set(true);
    this.toggleNewItemNameComponentDisplay(true);
  }

  creaNewItemName(itemFamily: string) {
    this.itemNameService.createItemName({ UserId: this.authService.user()?.id, ItemFamily: itemFamily } as CreateItemNameDto)
      .subscribe(
        {
          next: itemName => {
            alert(`Código gerado: ${itemName.itemName}`);

            if (this.isNewFileBeingCreated()) {
              this.startCreoNewFileWindow(itemName.itemName);
            }

            this.isNewFileBeingCreated.set(false);
            this.toggleNewItemNameComponentDisplay(false);

          },
          error: error => alert(error.error.detail)
        }
      );
  }

  startCreoNewFileWindow(newFileName: string | null) {
    this.creoSessionService.startCreoNewFileWindow(newFileName);
  }

  cancelItemNameCreation() {
    this.toggleNewItemNameComponentDisplay(false);

    if (this.isNewFileBeingCreated()) {
      this.isNewFileBeingCreated.set(false);
      this.startCreoNewFileWindow(null);
    }
  }

  toggleNewItemNameComponentDisplay(displayComponent: boolean) {
    this.displayNewItemNameComponent.set(displayComponent);
  }

  deleteAndCloseSelectedModels() {
    if (this.selectedItems().length == 0) {
      alert("Nenhum item selecionado");
      return;
    }

    if (!confirm("Deseja realmente excluir os items selecionados?")) {
      return;
    }

    let ModelsToDelete: Model[] = [];
    this.selectedItems().forEach(item => item.models.forEach(model => ModelsToDelete.push(model)));

    this.deleteWorkspaceFiles(ModelsToDelete);

    let itemsToDeleteRevision = this.selectedItems().filter(file => file.status == FileStatus[FileStatus.checkedOut]);
    let itemsRevisionData: ItemRevisionData[] = itemsToDeleteRevision.map(item => { return { itemId: item.id, itemName: item.name, userId: this.authService.user()!.id } });

    this.itemService.uncheckoutItems(itemsRevisionData).subscribe(
      {
        complete: () => this.workspaceService.getWorkspaceFiles()
      }
    );

    this.closeCreoModels(ModelsToDelete);
    this.workspaceService.getWorkspaceFiles();
  }


  private deleteWorkspaceFiles(models: Model[]) {
    for (let model of models) {
      this.workspaceService.deleteWorkspaceFile(model.filePath).subscribe(
        {
          error: error => {
            alert(`Ocorreu um erro ao tentar excluir o arquivo: ${model.filePath}`);
          }
        }
      );
    }
  }

  private closeCreoModels(models: Model[]) {
    if (this.creoConnected()) {
      let filePaths = models.map(model => model.filePath);
      this.creoSessionService.closeCreoFiles(filePaths);
    }
  }




}

