import { Cents } from "./money";

export type Component = {
    title: string;
    vendorUrl?: string;
    unitName: string;
    unitQtyPerPack: number;
    unitPrice: string;
    usageQtyPerProduct: number;

    unitCostPerProduct?: Cents;
}