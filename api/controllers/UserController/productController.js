import ProductDB from "../../Models/productSchema.js";
import CategoryDB from "../../Models/categorySchema.js";
import { errorHandler } from "../../Middleware/error.js";
import ReviewDB from "../../Models/reviewSchema.js";

//get products with category : sneaker
export const getSneakerProducts = async (req, res) => {
  try {
    // find the category with name sneaker
    const sneakerCategory = await CategoryDB.findOne({
      name: { $regex: /^sneaker(s)?$/i },
      isActive: true,
    });

    if (!sneakerCategory) {
      return next(errorHandler(404, "Sneaker category not found"));
    }

    const products = await ProductDB.find({ category: sneakerCategory._id })
      .limit(6)
      .populate("category", "name")
      .populate("brand", "name");


    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("Error fetching sneaker products", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//   fetch specific categories in order
export const getCategoryToDisplay = async (req, res, next) => {
  try {
    const categoryNames = ["Sneaker", "High Tops", "Running Shoe"];

  
    const categories = await CategoryDB.find({ name: { $in: categoryNames } });

    // Sort the categories in the  order
    const sortedCategories = categoryNames.map((name) =>
      categories.find((category) => category.name === name)
    );

 
    const filteredCategories = sortedCategories.filter((category) => category);

    res.status(200).json({ categories: filteredCategories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return next(errorHandler(500, "Failed to fetch categories"));
  }
};

//get a particular product
export const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await ProductDB.findById(id)
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) {
      return next(errorHandler(404, "Product Not found"));
    }

    return res.status(200).json({
      message: "Product fetched Successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product details", error);
    return next(errorHandler(500, "Internal server error"));
  }
};

//get related products
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { category, exclude } = req.query;

    if (!category) {
      return next(errorHandler(400, "Category is required"));
    }

    //find the product with the category by excluding the current product
    const products = await ProductDB.find({
      category,
      _id: { $ne: exclude },
    })
      .populate("category", "name")
      .populate("brand", "name");

    return res.status(200).json({
      message: "Related products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("Error fetching related products");
    return next(errorHandler(500, "internal server error"));
  }
};
