
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true
    },
    category :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    brand : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Brand',
        required : true,
    },
    offer :{
        type : Number,
        default : 0,
        min : [0,"offer cannot be negative"],
    },
    images : {
        type : [String],
        default :[],
    },
    isActive : {
        type : Boolean,
        default : true
    },
    variants : [
        {
            size : {
                type : String,
                required : true,
            },
            regularPrice :{
                type : Number,
                required : true,
                min : [0,"Regular price cannot be negative"],
            },
            quantity:{
                type : Number,
                required : true,
                min : [0, "Quantity cannot be negative"]
            },
        },
    ],
 },
  {timestamps : true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
 
);

productSchema.virtual('totalStock').get(function() {
    return this.variants.reduce((acc,variant) => acc+variant.quantity,0)
});

const ProductDB = mongoose.model("Product",productSchema);

export default ProductDB    