import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,  
        required: true,
    },
    lastName: {
        type: String,  
        required: true
    },
    email: {
        type: String,  
        required: true,
        unique: true
    },
    phone: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user" 
    },
    isBlocked: {
        type: Boolean,  
        required: true,
        default: false    
    },
    referralCode :{
        type : String,
        
    },
    referredBy : {
        type : mongoose.Types.ObjectId,
        ref : "user",
        default : null,
    },
    usedCoupons: [{
         type: mongoose.Schema.Types.ObjectId, ref: "Coupon" 
        }]
}, {
    timestamps: true 
});


const usersDB = mongoose.model('user', userSchema);

export default usersDB;
