import { z } from "zod";

export const componentDto = z.object({
    title: z.string().min(1).max(200),
    vendorUrl: z.string().url().optional(),
    unitName: z.string().min(1).max(20),
    unitQtyPerPack: z.number().positive(),
    unitPriceCents: z.number().int().nonnegative(),
    usageQtyPerProduct: z.number().positive(),
});

export const productDto = z.object({
    title: z.string().min(1).max(200),
    laborMinutes:z.number().int().nonnegative(),
    laborRateCentsPerHour:z.number().int().nonnegative(),
    components: z.array(componentDto).default([]),
});

export type ProductDto = z.infer<typeof productDto>;
export type ComponentDto = z.infer<typeof componentDto>;
