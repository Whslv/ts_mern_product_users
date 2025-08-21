import mongoose, { Types, Schema } from "mongoose";
import { IComponent, IProduct } from "../types/product";
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';


const componentSchema = new Schema<IComponent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    vendorUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/.+/i.test(v),
        message: "vendorUrl must be http(s) URL",
      },
    },
    unitName: { type: String, required: true, trim: true, maxlength: 20 },
    unitQtyPerPack: { type: Number, required: true, min: 0.0001 },
    unitPriceCents: { type: Number, required: true, min: 0 },
    usageQtyPerProduct: { type: Number, required: true, min: 0.0001 },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

componentSchema.virtual("unitCostPerProduct").get(function (this: IComponent) {
  const costPerUnit = this.unitPriceCents / this.unitQtyPerPack;
  return Math.ceil(costPerUnit * this.usageQtyPerProduct);
});

const productSchema = new Schema<IProduct>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
      index: true,
    },
    image: {
      type: Buffer,
    },
    imageType: { type: String },
    laborMinutes: { type: Number, required: true, min: 0 },
    laborRateCentsPerHour: { type: Number, required: true, min: 0 },
    components: { type: [componentSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const calcMaterialsCostCents = (product: IProduct) => {
  return (product.components ?? []).reduce((sum, component: IComponent) => {
    const perProduct =
    component.unitCostPerProduct ??
    Math.ceil(
      (component.unitPriceCents / component.unitQtyPerPack) *
      component.usageQtyPerProduct
    );
    return sum + perProduct;
  }, 0);
};

const calcLaborCostCents = (product: IProduct) => {
  const hour = product.laborMinutes / 60;
  return Math.round(hour * product.laborRateCentsPerHour);
};

const calcTotalCostCents = (product: IProduct) => {
  return calcLaborCostCents(product) + calcMaterialsCostCents(product);
};

productSchema.virtual("materialsCostCents").get(function (this: IProduct) {
  return calcMaterialsCostCents(this);
});

productSchema.virtual("laborCostCents").get(function (this: IProduct) {
  return calcLaborCostCents(this);
});

productSchema.virtual("totalCostCents").get(function (this: IProduct) {
  return calcTotalCostCents(this);
});

componentSchema.plugin(mongooseLeanVirtuals);
productSchema.plugin(mongooseLeanVirtuals);

export default mongoose.model<IProduct>("Product", productSchema);
