export interface Model {
    
      id: number;
      name: string;
      commonName: string;
      type: string;
      version: number;
      revision: string;
      filePath: string;
      itemId: number;
      createdBy: number;
      checkedOutBy?: number;
      createdAt: Date;
      checkedOutAt?: Date;
}
