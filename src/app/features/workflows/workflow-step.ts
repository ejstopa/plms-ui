import { ItemAttribute } from "../../core/Item/item-attribute";

export interface WorkflowStep {
    id: number;
    name: string;
    departmentId: number;
    isUserExclusive: boolean;
    stepOrder: number
    itemAttributes: ItemAttribute[];
}
