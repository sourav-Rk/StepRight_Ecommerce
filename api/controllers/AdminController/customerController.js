//Models
import usersDB from "../../Models/userSchema.js";
import { errorHandler } from "../../Middleware/error.js";
import mongoose from "mongoose";

//fetch user details
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";

    const filter = {
      role: "user",
      ...(searchTerm && {
        $or: [
          {
            firstName: { $regex: searchTerm, $options: "i" },
          },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }),
    };

    const totalUsers = await usersDB.countDocuments(filter);
    const users = await usersDB
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "customers fetched successfully",
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    return next(errorHandler(500, "something wenet wrong! please try again"));
  }
};

//block or unblock users
export const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await usersDB.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    return next(errorHandler(500, "something went wron"));
  }
};
