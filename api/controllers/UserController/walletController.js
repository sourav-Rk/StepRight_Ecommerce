import mongoose from "mongoose";
import { errorHandler } from "../../Middleware/error.js";
import walletDB from "../../Models/walletSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";

//to get the wallet
export const getWallet = async (req, res, next) => {
  const { transactionType = "all", limit = 10, currentPage = 1 } = req.query;
  try {
    const userId = refreshTokenDecoder(req);

    let typeArray;
    if (transactionType === "all") {
      typeArray = ["Credit", "Debit"];
    } else {
      typeArray = [transactionType];
    }

    const skip = (Number(currentPage) - 1) * Number(limit);

    // Aggregation pipeline
    const wallet = await walletDB.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      {
        $project: {
          transactions: {
            $filter: {
              input: "$transactions",
              as: "transaction",
              cond: { $in: ["$$transaction.transactionType", typeArray] },
            },
          },
          balance: 1,
        },
      },

      {
        $addFields: {
          transactions: {
            $sortArray: {
              input: "$transactions",
              sortBy: { transactionDate: -1 },
            },
          },
        },
      },
      
      {
        $addFields: {
          transactionCount: { $size: "$transactions" },
          transactions: { $slice: ["$transactions", skip, Number(limit)] },
        },
      },
    ]);

    if (!wallet || wallet.length === 0) {
      return next(errorHandler(404, "Wallet not found"));
    }

    const numberofPages = Math.ceil(wallet[0].transactionCount / Number(limit));
    wallet[0].numberofPages = numberofPages;
    return res.status(200).json({
      message: "wallet fetched successfully",
      wallet: { ...wallet[0], numberofPages },
    });
  } catch (error) {
    return next(
      errorHandler(500, "Something went wrong while fetching wallet")
    );
  }
};

//to deduct the wallet amount
export const deductWalletAmount = async (req, res, next) => {
  const { amount, description } = req.body;
  if (!amount || isNaN(amount) || amount <= 0)
    return next(errorHandler(400, "Please provide a valid positive amount"));

  try {
    const userId = refreshTokenDecoder(req);

    const wallet = await walletDB.findOne({ userId });
    if (!wallet) return next(errorHandler(404, "Wallet not found"));

    if (wallet.balance < amount)
      return next(errorHandler(400, "Insufficient wallet balance"));

    const transactionDetails = {
      description: description || `Payment for order`,
      transactionDate: new Date(),
      transactionType: "Debit",
      transactionStatus: "Success",
      amount: amount,
    };

    //update the wallet balance
    const walletUpate = await walletDB.updateOne(
      { userId },
      {
        $push: { transactions: transactionDetails },
        $inc: { balance: -amount },
      }
    );

    if (walletUpate.modifiedCount === 0 && walletUpate.upsertedCount === 0) {
      return next(errorHandler(404, "Wallet update failed"));
    }
    return res.status(200).json({
      success: true,
      message: "Wallet amount deducted successfully",
    });
  } catch (error) {
    console.log("Error deducting wallet amount", error);
    return next(
      errorHandler(500, "Something went wrong while deducting wallet balance")
    );
  }
};

//to add money to wallet
export const addMoneyToWallet = async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return next(errorHandler(400, "Please provide a valid positive amount"));
  }

  try {
    const userId = refreshTokenDecoder(req);
    const transactionDetails = {
      description: "Refunded amount",
      transactionDate: new Date(),
      transactionType: "Credit",
      transactionStatus: "Success",
      amount,
    };

    const walletUpdate = await walletDB.updateOne(
      { userId },
      {
        $push: { transactions: transactionDetails },
        $inc: { balance: amount },
      },
      { upsert: true }
    );

    if (walletUpdate.modifiedCount === 0 && walletUpdate.upsertedCount === 0) {
      return next(errorHandler(404, "Wallet not found"));
    }

    return res.status(200).json({
      message: "Money added to wallet successfully",
    });
  } catch (error) {
    return next(
      errorHandler(500, "Something went wrong during adding money to wallet")
    );
  }
};
