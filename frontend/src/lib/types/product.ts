import { Component } from "react";
import { Cents } from "./money";


export type Product = {
    _id: string;
    title: string;
    image?: Buffer;
    imageType?: string;
    laborMinutes: number;
    laborRateCentsPerHour: Cents;
    sellingPriceCents: Cents;
    components: Component[];
    
    materialsCostCents?: Cents;
    laborCostCents?: Cents;
    totalCostCents?: Cents;

    profitAmountCents?: Cents;
    profitPercentOfCost?: number | null;
    profitMarginPercent?: number | null;
}
