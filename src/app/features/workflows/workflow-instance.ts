import { Item } from "../../core/Item/item";

export interface WorkflowInstance {
    id: number;
    workflowTemplateId: number;
    itemId: number;
    itemName: string;
    itemRevision: string;
    userId: number;
    currentStepId: number;
    previousStepId: number;
    status: string;
    message: string;
    itemFamilyId: number;
    item: Item;
}
