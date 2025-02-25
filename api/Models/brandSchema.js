import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required : true,
            unique : true,
            trim : true,
        },
        isActive : {
            type : Boolean,
            default : true,
        }
    },
    {
        timestamps : true,
    }
);

const BrandDB = mongoose.model('Brand',brandSchema);

export default BrandDB;