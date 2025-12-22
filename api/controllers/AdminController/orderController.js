import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../Middleware/error.js";
import walletDB from "../../Models/walletSchema.js";

//to get all orders made by the user
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    // Create search filter
    const filter = {
      $or: [
        { orderId: { $regex: search, $options: "i" } },
        { "userId.firstName": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
        { "userId.phone": { $regex: search, $options: "i" } },
        { "deliveryAddress.fullname": { $regex: search, $options: "i" } },
      ],
    };

    const totalOrders = await orderDB.countDocuments(filter);

    // Fetch orders with pagination
    const orders = await orderDB
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName email phone");

    if (!orders || orders.length === 0) {
      return next(errorHandler(404, "No orders found"));
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      pagination: {
        total: totalOrders,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    return next(errorHandler(500, "Something went wrong! Please try again"));
  }
};

//to get a order by its id
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderDB
      .findOne({ orderId })
      .populate({
        path: "items.product",
        populate: { path: "category", select: "name -_id" },
      })
      .populate("userId", "firstName , email , phone");

    if (!order) return next(errorHandler(404, "Order Not Found"));

    return res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, "something went wrong! please try again"));
  }
};

//to change the status of the order
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) return next(errorHandler(400, "Status is required"));

    //check the newstatus is one of the allowed statuses
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(newStatus)) {
      return next(errorHandler(400, "Invalid status value"));
    }

    const order = await orderDB.findOne({ orderId });
    if (!order) return next(errorHandler(404, "Order not found"));

    const allowedTransitions = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    //check if the new status is allowed
    if (!allowedTransitions[order.status].includes(newStatus)) {
      return next(
        errorHandler(
          400,
          `Cannot change status from ${order.status} to ${newStatus}`
        )
      );
    }
    order.status = newStatus;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.log("Error in updating status", error);
    return next(errorHandler(500, "Something went wrong!Please try again"));
  }
};

//change the status of a single item in the order
export const updateSingleOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) return next(errorHandler(400, "Status is required"));

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(newStatus))
      return next(errorHandler(400, "Invalid status value"));

    const order = await orderDB.findOne({ orderId });
    if (!order) return next(errorHandler(404, "Order not found"));

    const item = order.items.id(itemId);
    if (!item) return next(errorHandler(404, "Item not found"));

    const allowedTransitions = {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowedTransitions[item.status].includes(newStatus)) {
      return next(
        errorHandler(
          400,
          `cannot change status from ${item.status} to ${newStatus}`
        )
      );
    }

    item.status = newStatus;
    await order.save();

    return res
      .status(200)
      .json({ message: "Item status updated successfully" });
  } catch (error) {
    return next(errorHandler(500, "Something went wrong! Please try again"));
  }
};

//to update refund status
export const updateRefundStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;

    const newRefundStatus = "Approved";
    if (!["Approved", "Rejected"].includes(newRefundStatus)) {
      return next(errorHandler(400, "Invalid refund status"));
    }

    const order = await orderDB.findOne({ orderId });
    if (!order) return next(errorHandler(404, "Order not found"));

    const item = order.items.id(itemId);
    if (!item) return next(errorHandler(404, "order item not found"));

    if (item.refundStatus !== "Pending") {
      return next(errorHandler(400, "Refund request is not pending"));
    }

    // Calculate the refund amount
    const discountAmountDerived =
      order.subtotal + order.tax - order.totalAmount;
    const effectiveDiscountRate = order.subtotal
      ? discountAmountDerived / order.subtotal
      : 0;
    const refundAmount = Math.round(
      item.productPrice * item.quantity * (1 - effectiveDiscountRate)
    );

    item.refundStatus = newRefundStatus;
    item.refundAmount = refundAmount;
    await order.save();

    const walletUpdate = await walletDB.updateOne(
      { userId: order.userId },
      {
        $push: {
          transactions: {
            description: `Refund for order ${order.orderId}`,
            transactionDate: new Date(),
            transactionType: "Credit",
            transactionStatus: "Success",
            amount: refundAmount,
          },
        },
        $inc: { balance: refundAmount },
      },
      { upsert: true }
    );

    if (walletUpdate.modifiedCount === 0 && walletUpdate.upsertedCount === 0) {
      return next(errorHandler(404, "Wallet not found"));
    }

    return res.status(200).json({
      message: `Refund request ${newRefundStatus.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.log("Error updating refund status", error);
    return next(
      errorHandler(500, "Something went wrong while updating refund status")
    );
  }
};
