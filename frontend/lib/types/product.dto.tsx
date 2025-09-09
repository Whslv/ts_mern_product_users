import { z } from "zod";

type Price = number | string | undefined | null;

const toCents = (priceInDollars: Price): number => {
  if (priceInDollars === undefined || priceInDollars === null) {
    throw new Error("Price is required");
  }

  const priceToString = String(priceInDollars)
    .trim()
    .replace(/[$,\s]/g, "");
  if (priceToString === "") throw new Error("Price is required");

  const numberValidation = /^(?:\d+|\d*\.\d{1,2})$/;
  if (!numberValidation.test(priceToString))
    throw new Error("Invalid price format");

  const priceInCents = Math.round(parseFloat(priceToString) * 100);
  if (!Number.isFinite(priceInCents)) throw new Error("Invalid price value");
  return priceInCents;
};

const moneyDollars = z.union([z.string(), z.number()]);

export const componentInputDto = z.object({
  title: z.string().trim().min(1).max(200),
  vendorUrl: z.string().trim().url().optional(),
  unitName: z.string().trim().min(1).max(20),
  unitQtyPerPack: z.number().positive(),
  unitPrice: moneyDollars,
  usageQtyPerProduct: z.number().positive(),
});

export const productInputDto = z
  .object({
    title: z.string().trim().min(1).max(200),
    laborMinutes: z.number().int().nonnegative(),
    laborRatePerHour: moneyDollars,
    sellingPrice: moneyDollars,
    components: z.array(componentInputDto).default([]),
  })
  .transform(
    ({ title, laborMinutes, laborRatePerHour, sellingPrice, components }) => ({
      title,
      laborMinutes,
      laborRateCentsPerHour: toCents(laborRatePerHour),
      sellingPriceCents: toCents(sellingPrice),
      components: components.map((component) => ({
        title: component.title,
        vendorUrl: component.vendorUrl,
        unitName: component.unitName,
        unitQtyPerPack: component.unitQtyPerPack,
        unitPriceCents: toCents(component.unitPrice),
        usageQtyPerProduct: component.usageQtyPerProduct,
      })),
    })
  );

export type ComponentInputDto = z.input<typeof componentInputDto>;
export type ProductInputDto = z.input<typeof productInputDto>;
export type ProductTransCents = z.output<typeof productInputDto>;
