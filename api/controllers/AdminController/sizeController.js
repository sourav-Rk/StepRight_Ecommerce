import SizeDB from "../../Models/sizeSchema.js";
import { errorHandler } from "../../Middleware/error.js";

//Add size
export const addSize = async (req, res, next) => {
  try {
    const { size } = req.body;

    if (!size || size.trim() === "") {
      return next(errorHandler(400, "Size name is required"));
    }

    const existingSize = await SizeDB.findOne({
      size: { $regex: new RegExp("^" + size.trim() + "$", "i") },
    });

    if (existingSize) {
      return next(errorHandler(400, "Size already exists"));
    }

    const newSize = new SizeDB({ size: size.trim().toUpperCase() });
    await newSize.save();

    return res.status(201).json({
      message: "Size added successfully",
    });
  } catch (error) {
    console.error("Error adding size :", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//fetch sizes
export const getSizes = async (req, res, next) => {
  try {
    const sizes = await SizeDB.find();

    return res
      .status(200)
      .json({ message: "sizes fetched successfully", sizes: sizes });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

//fetch sizes for product add
export const getSizesForProduct = async (req, res, next) => {
  try {
    const sizes = await SizeDB.find({ isActive: true });

    return res
      .status(200)
      .json({ message: "sizes fetched successfully", sizes: sizes });
  } catch (error) {
    return next(errorHandler(500, "Internal server error"));
  }
};

//block or unblock the size
export const blockSize = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await SizeDB.findById(id);

    if (!brand) {
      return next(errorHandler(404, "Brand not found"));
    }

    brand.isActive = !brand.isActive;

    await brand.save();

    return res
      .status(200)
      .json({
        message: `${brand.name} has been ${brand.isActive} ? "blocked" : "unblocked"`,
      });
  } catch (error) {
    return next(errorHandler(500, "Internal server error.Please try again"));
  }
};
