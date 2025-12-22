import BrandDB from "../../Models/brandSchema.js";
import { errorHandler } from "../../Middleware/error.js";

//get brand
export const getBrand = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const totalBrand = await BrandDB.countDocuments();

    const brands = await BrandDB.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "brands fetched successfully",
      brands: brands,
      totalPages: Math.ceil(totalBrand / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

//Add brand
export const addBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(404).json({ message: "brand cannot be empty" });
    }

    //to check the name contains only digit
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({ message: "brand name must contain only alphabets and spaces" });
    }

    const existingBrand = await BrandDB.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const newBrand = new BrandDB({
      name,
    });

    await newBrand.save();

    return res.status(200).json({ message: "Brand added successfully" });
  } catch (error) {
    console.log("error adding category");
    return res
      .status(500)
      .json({ message: "Internal server error! please try again" });
  }
};

//block or unblock the brand
export const blockBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await BrandDB.findById(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.isActive = !brand.isActive;

    await brand.save();

    return res
      .status(200)
      .json({
        message: `${brand.name} has been ${brand.isActive} ? "blocked" : "unblocked"`,
      });
  } catch (error) {
    console.log("error in blocking", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//edit the brand
export const editBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    if (!name) {
      return next(errorHandler(400, "Name is required"));
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return next(
        errorHandler(400, "brand name must contain only alphabets and spaces")
      );
    }

    const existingBrand = await BrandDB.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingBrand) {
      return next(errorHandler(400, "Brand already exists"));
    }

    const updateBrand = await BrandDB.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updateBrand) {
      return next(errorHandler(404, "brand Not found"));
    }

    return res.status(200).json({
      message: "brand updated successfully",
      brand: updateBrand,
    });
  } catch (error) {
    return next(errorHandler(500, "internal server error"));
  }
};
