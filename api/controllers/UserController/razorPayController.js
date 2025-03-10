import { read } from "fs";
import {razorpay} from "../../config/RazorPay.js"
import {errorHandler} from "../../Middleware/error.js"
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config(); 

//make payment
export const makePayment=async(req,res,next)=>{
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount)) {
        return next(errorHandler(400, "Invalid or missing amount"));
        }
        const options = {
            amount: Number(amount) * 100, 
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
          };

         
        const order = await razorpay.orders.create(options);
        res.status(200).json({message :"order created successfully",order});
      } catch (err) {
        
        return next(errorHandler(500,"Somethinggg went wrong"));
      }
}


// Helper function that verifies payment signature
export const paymentVerification = (req,res,next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');
  
    
    if (razorpay_signature !== expectedSign) {
      throw new Error("Invalid payment signature");
    }
    return res.status(200).json({success : true});
  };
  

  