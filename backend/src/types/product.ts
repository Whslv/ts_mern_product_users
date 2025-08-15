import { Types } from "mongoose";
import { Cents } from "./money";

export interface IComponent {
    title: string;
    vendorUrl?: string;
    unitName: string;
    unitQtyPerPack: number;
    unitPriceCents: Cents;
    usageQtyPerProduct: number;

    unitCostPerProduct?: Cents;
}

export interface IProduct {
    user: Types.ObjectId;
    title: string;
    image?: Buffer;
    imageType?: string;
    laborMinutes: number;
    laborRateCentsPerHour: Cents;
    components: IComponent[];
    
    materialsCostCents?: Cents;
    laborCostCents?: Cents;
    totalCostCents?: Cents;
}
