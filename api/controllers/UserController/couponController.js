import { errorHandler } from "../../Middleware/error.js";
import CouponDB from "../../Models/couponSchema.js";

//to get coupons
export const getCoupons = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const coupons = await CouponDB.find({
      isActive: true,
      expiryDate: { $gte: currentDate },
    });

    res.status(200).json({ message: "Coupons fetched successfully", coupons });
  } catch (error) {
    return next(errorHandler(500, "Something went wrong"));
  }
};
