import { errorHandler } from "../../Middleware/error.js";
import ProductDB from "../../Models/productSchema.js";
import ReviewDB from "../../Models/reviewSchema.js";
import usersDB from "../../Models/userSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";

//to add a review
export const addReview = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);
    const { productId, rating, reviewText } = req.body;

    if (!productId) return next(errorHandler(400, "Product Id is required"));
    if (!reviewText || !rating)
      return next(errorHandler(400, "review text or rating is required"));

    const existingProduct = await ProductDB.findOne({ _id: productId });
    if (!existingProduct) return next(errorHandler(404, "Product not found"));

    const checkexistingReview = await ReviewDB.findOne({ productId, userId });
    if (checkexistingReview)
      return next(errorHandler(400, "You have already reviewed this product"));

    const newReview = new ReviewDB({
      userId,
      productId,
      reviewText,
      rating,
    });

    await newReview.save();

    //update average rating
    const reviews = await ReviewDB.find({ productId });
    const avgRating =
      reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

    await ProductDB.findByIdAndUpdate(productId, { averageRating: avgRating });
    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    return next(errorHandler(500, "Something went wrong"));
  }
};

//to get the reviews of a product
export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) return next(errorHandler(400, "Product id is required"));

    const reviews = await ReviewDB.find({ productId })
      .populate("userId", "firstName")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Reviews fetched successfully", reviews });
  } catch (error) {
    console.log("error in fetching reviews", error);
    return next(errorHandler(500, "something went wrong"));
  }
};
