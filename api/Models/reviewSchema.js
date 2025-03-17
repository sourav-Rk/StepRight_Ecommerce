import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true
        },
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true
        },
        rating : {
            type : Number,
            min : 0,
            max :5
        },
        reviewText : {
            type : String,
            trim : true
        },
    },
    {timestamps : true}
);


const ReviewDB = mongoose.model('Review',reviewSchema);
export default ReviewDB