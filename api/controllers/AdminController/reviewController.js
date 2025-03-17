import ReviewDB from "../../Models/reviewSchema.js";
import { errorHandler } from '../../Middleware/error.js'

export const getAdminReviews = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "newest";
    let sortStage = {};
    switch (sortBy) {
      case "newest":
        sortStage = { createdAt: -1 };
        break;
      case "oldest":
        sortStage = { createdAt: 1 };
        break;
      case "highest":
        sortStage = { rating: -1 };
        break;
      case "lowest":
        sortStage = { rating: 1 };
        break;
    }

    // Column sorting
    if (req.query.sortField && req.query.sortOrder) {
      sortStage = { [req.query.sortField]: req.query.sortOrder === "asc" ? 1 : -1 };
    }

    // Filters
    const matchStage = {};
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        matchStage.$or = [
          { reviewText: searchRegex },
          { "user.name": searchRegex },
          { "product.name": searchRegex }
        ];
      }
    if (req.query.rating) matchStage.rating = { $gte: parseInt(req.query.rating) };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      matchStage.$or = [
        { reviewText: searchRegex },
        { "user.name": searchRegex },
        { "product.name": searchRegex }
      ];
    }

    // Main pipeline
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: matchStage },
      { $sort: sortStage },
    
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          rating: 1,
          reviewText: 1,
          createdAt: 1,
          "user._id": 1,
          "user.firstName": 1,
          "product._id": 1,
          "product.name": 1,
          "product.images": 1,
        },
      },
    ];

    // Count pipeline
    const countPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: matchStage },
      { $count: "total" },
    ];

    const [reviews, countResult] = await Promise.all([
      ReviewDB.aggregate(pipeline),
      ReviewDB.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch reviews"));
  }
};