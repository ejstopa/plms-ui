import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { getCreoSession, setWorkingDirectory, setConfigOption, openFile, closeFile, startNewFileWindow } from '../weblink/wl-session';
import { CreoConstantsService } from './creo-constants.service';
import { LoadingService } from '../../loading/loading.service';


@Injectable({
  providedIn: 'root'
})
export class CreoSessionService {
  private authService = inject(AuthService);
  private creoConstantsService = inject(CreoConstantsService);
  private loadingService = inject(LoadingService);

  private creSessionSignal = signal<any | null>(null);
  private workspaceDirectorySignal = signal<string | null>(null);

  creoSession = computed(() => this.creSessionSignal());
  isConnected = computed(() => this.creSessionSignal() ? true : false);
  workspaceDirectory = computed(() => this.workspaceDirectorySignal());

  constructor() {
    this.creSessionSignal.set(getCreoSession());
    this.setUserWorkspaceDirectory();

    effect(() => {
      if (this.creSessionSignal()) {
        this.setUserWorkspace();
        this.setAllLibrarySearchPath();
      }
    })
  }

  private setUserWorkspaceDirectory() {
    try {
      if (this.authService.user()) {
        this.workspaceDirectorySignal.set(
          `${this.creoConstantsService.workspaceBaseDirectoty}/${this.authService.user()?.windowsUser}`)
      }
    }
    catch (error) {
      alert(error);
    }
  }

  private setUserWorkspace() {
    try {
      setWorkingDirectory(this.creSessionSignal(), this.workspaceDirectorySignal());
    }
    catch (error) {
      alert("Ocorreu um erro ao configurar sua workspace");
    }
  }

  private setAllLibrarySearchPath() {
    try {
      this.creoConstantsService.librarySubFolders.forEach((subFolder) => {
        this.setFileSearchPath(`${this.creoConstantsService.libraryBaseDirectory}/${subFolder}`);
      });
    }
    catch (error) {
      alert("Ocoreu um erro ao configurar os caminhos de busca de arquivos");
    }
  }

  private setFileSearchPath(searchPath: string) {
    try {
      setConfigOption(this.creSessionSignal(), "search_path", searchPath);
    }
    catch (error) {
      alert(`Ocoreu um erro ao configurar o seguinte caminho de busca de arquivos:  ${searchPath}`);
    }
  }

  openCreoFiles(filePaths: string[]) {
    this.loadingService.setLoadingStart();

    for (let filePath of filePaths) {
      try {
        openFile(this.creSessionSignal(), filePath);
      }
      catch (error) {
        this.loadingService.setLoadingEnd();
        alert(`Ocorreu um erro ao tentar abrir o arquivo: ${filePath}`);
      }
    }

    this.loadingService.setLoadingEnd();
  }

  closeCreoFiles(filePaths: string[]): boolean{
    this.loadingService.setLoadingStart();

    for (let filePath of filePaths) {
      try {
        closeFile(this.creSessionSignal(), filePath);
      }
      catch (error) {
        this.loadingService.setLoadingEnd();
        alert(`Ocorreu um erro ao tentar fechar o arquivo: ${filePath}`);

        return false;
      }
    }

    this.loadingService.setLoadingEnd();

    return true;
  }

  startCreoNewFileWindow(newFileName: string | null) {
    try {
      startNewFileWindow(this.creSessionSignal(), newFileName);
    }
    catch (error) {
      alert("Ocorreu um erro ao tentar criar o arquivo");
    }
  }













}
