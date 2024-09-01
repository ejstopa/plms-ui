import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { CreoSessionService } from '../../../core/creo/services/creo-session.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkspaceService } from '../workspace.service';
import { FilesListComponent } from "../../../core/file/files-list/files-list.component";
import { LoadingComponent } from '../../../core/loading/loading.component';
import { WorkspaceToolbarComponent } from '../workspace-toolbar/workspace-toolbar.component';
import { FileData } from '../../../core/file/file-data';
import { FileService } from '../../../core/file/file.service';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [FilesListComponent, WorkspaceToolbarComponent, LoadingComponent],
  templateUrl: './workspace-page.component.html',
  styleUrl: './workspace-page.component.scss'
})
export class WorkspacePageComponent implements OnInit{


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
  private workspaceService = inject(WorkspaceService);
  private fileService = inject(FileService);
  private fileExtensions = [".prt", ".asm", ".drw"];

  creoConnected = computed(() => this.creoSessionService.isConnected());
  user = computed(() => this.authService.user());
  workspaceFiles = computed(() => this.fileService.filterFilesByExtension(this.workspaceService.workspaceFiles().value, this.fileExtensions))
  workspaceError = computed(() => this.workspaceService.workspaceFiles().error);
  selectedFiles = signal<FileData[]>([]);

  ngOnInit(): void {
    this.workspaceService.getWorkspaceFiles();
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

  startNewFileWindow() {
    this.creoSessionService.startCreoNewFileWindow();
  }

  deleteAndCloseSelectedFiles() {
    if (this.selectedFiles().length == 0) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    if (!confirm("Deseja realmente excluir o arquivos selecionados?")) {
      return;
    }

    this.deleteWorkspaceFiles(this.selectedFiles());
    this.closeCreoFiles(this.selectedFiles());

    this.workspaceService.getWorkspaceFiles();
  }


  private deleteWorkspaceFiles(files: FileData[]) {
    for (let file of files) {
      this.workspaceService.deleteWorkspaceFile(file.fullPath).subscribe(
        {
          error: error => {
            alert(`Ocorreu um erro ao tentar excluir o arquivo: ${file.fullPath}`);
          }
        }
      );
    }
  }

  private closeCreoFiles(files: FileData[]) {
    if (this.creoConnected()) {
      let filePaths = files.map(file => file.fullPath);
      this.creoSessionService.closeCreoFiles(filePaths);
    }
  }




}

