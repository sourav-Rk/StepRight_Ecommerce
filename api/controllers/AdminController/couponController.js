import { errorHandler } from "../../Middleware/error.js";
import CouponDB from "../../Models/couponSchema.js";

//to fetch the coupons
export const getCoupons = async(req, res, next) =>{
    try{
        const coupons = await CouponDB.find({}).sort({createdAt : -1});
        return res.status(200).json({message :"Coupons fetched successfully",coupons});
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong"));
    }
}


//to create coupon
export const createCoupon = async (req,res,next) => {
    try{
        const {code,discountType,discountValue,minimumPurchase,expiryDate,usageLimit,description} = req.body;

        if(!code || !discountType ||discountValue==null || !minimumPurchase || !expiryDate || !description){
            return next(errorHandler(400,"Missing required fields"))
        };

        const existCoupon = await CouponDB.findOne({code});
        if(existCoupon) return next(errorHandler(400,"Coupon already exist!Try generating another one"));

        const coupon = new CouponDB({
            code,
            discountType,
            discountValue,
            minimumPurchase : minimumPurchase || 0,
            expiryDate,
            description
        });

        await coupon.save();
        return res.status(201).json({
            message : "Coupon created successfully",
            coupon
        });
    }
    catch(error){
        console.log("Error creating coupon",error);
        return next(errorHandler(500,"something went wrong"))
    }
};

//to block or unblock the coupon
export const blockCoupon = async (req, res, next) => {
    try{
        const {id} = req.params;
        if(!id) return next(errorHandler(404,"coupon id is required"));

        const coupon = await CouponDB.findOne({_id : id});
        if(!coupon) return next(errorHandler(404,"No coupon found"));

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        return res.status(200).json({message :`Updated the status`});
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong"));
    }
}

