import { ItemAttributeOption } from "./item-attribute-option";

export interface ItemAttribute {
    id: number;
    name: string;
    type: string;
    unit: string;
    options: ItemAttributeOption[];
}
