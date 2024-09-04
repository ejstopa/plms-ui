import { Model } from "../model/model";

export interface Item {
    id: number;
    name: string;
    lastRevision: string;
    description: string;
    family: string;
    status: string;
    createdBy: number;
    createdAt: Date;
    lastModifiedBy: number;
    lastModifiedAt: Date;
    checkedOutBy: 1;
    checkedOutAt: Date;
    models: Model[];
}
