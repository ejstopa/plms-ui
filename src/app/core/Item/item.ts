import { Model } from "../model/model";

export interface Item {
    id: number;
    name: string;
    revision: string;
    version: number;
    description: string;
    family: string;
    status: string;
    createdBy: number;
    createdAt: Date;
    lastModifiedBy: number;
    lastModifiedAt: Date;
    checkedOutBy: 1;
    familyId: number,
    models: Model[];
}
