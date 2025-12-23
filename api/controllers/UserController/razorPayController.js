import dotenv from "dotenv";
dotenv.config();
import { razorpay } from "../../config/RazorPay.js";
import { errorHandler } from "../../Middleware/error.js";
import crypto from "crypto";
import orderDB from "../../Models/orderSchema.js";

//make payment
export const makePayment = async (req, res, next) => {
  try {
    const items = req.cartItems;
    const { amount, couponCode } = req.body;

    // Recalculate subtotal
    let calculatedSubtotal = 0;
    items.forEach((item) => {
      calculatedSubtotal += item.productPrice * item.quantity;
    });

    //Fetch & validate coupon
    let coupon = null;
    let calculatedDiscount = 0;

    if (couponCode) {
      coupon = await CouponDB.findOne({ code: couponCode, isActive: true });
      if (!coupon) {
        return next(errorHandler(400, "Invalid coupon code"));
      }

      // check minimum purchase
      if (calculatedSubtotal < coupon.minimumPurchase) {
        return next(
          errorHandler(400, "Subtotal does not meet coupon requirements")
        );
      }

      // calculate discount
      if (coupon.discountType === "percentage") {
        calculatedDiscount = (calculatedSubtotal * coupon.discountValue) / 100;
      } else {
        calculatedDiscount = coupon.discountValue;
      }

      calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
    }

    //Calculate tax AFTER discount
    const TAX_RATE = 0.12;
    const taxableAmount = calculatedSubtotal - calculatedDiscount;
    const calculatedTax = taxableAmount * TAX_RATE;

    //Final total
    const calculatedTotal = Math.round(taxableAmount + calculatedTax);

    if (!amount || isNaN(amount)) {
      return next(errorHandler(400, "Invalid or missing amount"));
    }

    if (calculatedTotal !== amount) {
      return next(
        errorHandler(400, "Order amount mismatch. Please refresh and try again")
      );
    }

    const options = {
      amount: calculatedTotal * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ message: "order created successfully", order });
  } catch (err) {
    return next(errorHandler(500, "Somethinggg went wrong"));
  }
};

// Helper function that verifies payment signature
export const paymentVerification = (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    throw new Error("Invalid payment signature");
  }
  return res.status(200).json({ success: true });
};

//retry payment
export const retryPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await orderDB.findOne({ orderId });

    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    if (order.paymentStatus === "paid") {
      return next(errorHandler(400, "Order already paid"));
    }


    const options = {
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: `retry_${order.orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.transactionId = razorpayOrder.id;
    await order.save();

    res.status(200).json({ order: razorpayOrder });
  } catch (err) {
    next(errorHandler(500, "Retry payment failed"));
  }
};


