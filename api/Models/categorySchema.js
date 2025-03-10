import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique : true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    offer: {
      type: Number,
      default: 0,
      min: [0, "Offer cannot be negative"], 
    },
  },
  { timestamps: true } 
);


categorySchema.pre("updateOne", async function (next) {
  try {
    const update = this.getUpdate();
    const query = this.getQuery();

    if (update && update.offer !== undefined) {

      const categoryId = query._id;

      // Get the Product model (avoids circular dependency issues)
      const ProductDB = mongoose.model("Product");

      // Find all products in this category.
      const products = await ProductDB.find({ category: categoryId });

      // For each product, call save() so that its pre-save hook recalculates salePrice.
      for (const product of products) {
        await product.save();
      }
      console.log(
        `Recalculated salePrice for ${products.length} products in category ${categoryId}`
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const CategoryDB = mongoose.model("Category", categorySchema);


export default CategoryDB;
