import mongoose, { Schema } from "mongoose";

const sizeSchema = new mongoose.Schema({
    size:{
    type : String,
    required : true,
    trim : true,
    unique : true
    },
    isActive : {
        type : Boolean,
        default : true
    }
});

const SizeDB = mongoose.model("Size",sizeSchema);

export default SizeDB