import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    formData:{
        type : Object,
    },
    email :{
        type : String,
        required : true,
    },
    otp:{
        type : String,
        required : true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  
        expires: '60s'         
    }
});

const otpDB = mongoose.model('otp',otpSchema);

export default otpDB