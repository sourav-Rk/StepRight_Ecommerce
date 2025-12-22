import mongoose from "mongoose";
import CategoryDB from "./categorySchema.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    offer: {
      type: Number,
      default: 0,
      min: [0, "offer cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    variants: [
      {
        size: {
          type: String,
          required: true,
        },
        regularPrice: {
          type: Number,
          required: true,
          min: [0, "Regular price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity cannot be negative"],
        },
        salePrice: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("totalStock").get(function () {
  return this.variants.reduce((acc, variant) => acc + variant.quantity, 0);
});

//pre-save hook to calculate the saleprice for each variant
productSchema.pre("save", async function (next) {
  try {
    const categoryDoc = await CategoryDB.findById(this.category);
    const categoryOffer = categoryDoc ? categoryDoc.offer : 0;
    const productOffer = this.offer;

    let discount = 0;
    if (productOffer === 0 && categoryOffer === 0) {
      discount = 0;
    } else if (productOffer === 0) {
      discount = categoryOffer;
    } else if (categoryOffer === 0) {
      discount = productOffer;
    } else if (productOffer < categoryOffer) {
      discount = productOffer;
    } else {
      discount = categoryOffer;
    }

    //update sale price for each variants
    this.variants = this.variants.map((variant) => {
      if (variant.regularPrice) {
        const computedSalePrice =
          variant.regularPrice - (variant.regularPrice * discount) / 100;
        variant.salePrice = Math.max(0, computedSalePrice);
      }
      return variant;
    });
    next();
  } catch (error) {
    next(error);
  }
});

const ProductDB = mongoose.model("Product", productSchema);

export default ProductDB;
