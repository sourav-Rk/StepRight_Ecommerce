//User DB
import usersDB from "../../Models/userSchema.js";

import bcrypt from "bcrypt";

//access tokens and refresh token generators
import {
  generateAccessToken,
} from "../../utils/jwtToken/accessToken.js";
import {
  generateRefreshToken,
} from "../../utils/jwtToken/refreshToken.js";
import { errorHandler } from "../../Middleware/error.js";

export const verifyLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminExist = await usersDB.findOne({ email, role: "admin" });

    if (!adminExist) {
      return next(errorHandler(404, "Email doesnt exist"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminExist.password
    );

    if (!isPasswordCorrect) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    generateAccessToken(res, adminExist);
    generateRefreshToken(res, adminExist);

    const adminName = adminExist.firstName;

    return res
      .status(200)
      .json({
        message: "Logged in successfully",
        adminName,
        role: adminExist?.role ?? "admin",
      });
  } catch {
    return next(errorHandler(500, "something went wrong. Please try again"));
  }
};

//logout function
export const logoutAdmin = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  return res.status(200).json({ message: "Logout successfully" });
};
