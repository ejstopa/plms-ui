import { Injectable } from '@angular/core';
import { FileData } from './file-data';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() { }

  filterFilesByExtension(files: FileData[] | null, extensions: string[]): FileData[] | null {
    if (!files) {
      return null;
    }

    let workspaceFiles = files?.filter(
      file => extensions.some(extension => file.extension == extension));

    return workspaceFiles;
  }
}
