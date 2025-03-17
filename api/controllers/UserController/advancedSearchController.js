import mongoose from "mongoose";
import ProductDB from "../../Models/productSchema.js";
import { errorHandler } from "../../Middleware/error.js";

export const advancedSearchProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "newArrivals";
    let sortStage = {};

    switch (sortBy) {
      case "popularity":
        sortStage = { createdAt: -1 };
        break;
      case "priceLowToHigh":
        sortStage = { minPrice: 1 };
        break;
      case "priceHighToLow":
        sortStage = { minPrice: -1 };
        break;
      case "newArrivals":
        sortStage = { createdAt: -1 };
        break;
      case "AtoZ":
        sortStage = { name: 1 };
        break;
      case "ZtoA":
        sortStage = { name: -1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    let matchConditions = {
      isActive: true,
    };

    if (req.query.categoryId) {
      matchConditions.category = new mongoose.Types.ObjectId(
        req.query.categoryId
      );
    } else if (req.query.categories) {
      const categoryIds = req.query.categories
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id));
      matchConditions.category = { $in: categoryIds };
    }

    // Apply brand filter using IDs
    if (req.query.brands) {
      const brandIds = req.query.brands
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id));
      matchConditions.brand = { $in: brandIds };
    }

    if (req.query.name) {
      matchConditions.name = { $regex: req.query.name, $options: "i" };
    }

    // Main Pipeline
    const pipeLine = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      { $unwind: "$brandDetails" },
      {
        $match: {
          ...matchConditions,
          "categoryDetails.isActive": true,
          "brandDetails.isActive": true,
        },
      },
      // New review lookup and calculations
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews"
        }
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: { $avg: "$reviews.rating" }
        }
      },
      {
        $addFields: {
          minPrice: { $min: "$variants.salePrice" },
        },
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          description: 1,
          category: "$categoryDetails.name",
          brand: "$brandDetails.name",
          offer: 1,
          images: 1,
          isActive: 1,
          variants: 1,
          totalStock: { $sum: "$variants.quantity" },
          minPrice: 1,
          createdAt: 1,
          reviewCount: 1,
          averageRating: {
            $cond: [
              { $eq: ["$averageRating", null] },
              0,
              { $round: ["$averageRating", 1] }
            ]
          }
        },
      },
    ];

    // Count Pipeline
    const countPipeLine = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      { $unwind: "$brandDetails" },
      {
        $match: {
          ...matchConditions,
          "categoryDetails.isActive": true,
          "brandDetails.isActive": true,
        },
      },
      { $count: "total" },
    ];

    // Execute both pipelines
    const [products, countResult] = await Promise.all([
      ProductDB.aggregate(pipeLine),
      ProductDB.aggregate(countPipeLine),
    ]);

    const total = countResult[0]?.total || 0;

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in advancedSearchProducts:", error);
    next(errorHandler(500, "Something went wrong! Please try again"));
  }
};
