import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code : {
            type : String,
            required : true,
            unique : true,
            uppercase : true,
            trim : true
        },

        discountType :{
            type : String,
            enum:["percentage","amount"],
            required : true
        },
        discountValue : {
            type : Number,
            required : true,
            min : [0,"Discount value cannot be negative"]
        },
        minimumPurchase:{
            type : Number,
            default : 0,
            min:[0,"Minimum purchase cannot be negative"],
        },
        expiryDate : {
            type : Date,
            required : true
        },
        isActive : {
            type : Boolean,
            default: true
        },
        description :{
            type : String
        }

    },
    {timestamps : true}
);

const CouponDB = mongoose.model("Coupon",couponSchema);
export default CouponDB;