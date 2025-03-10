import wishListDB from "../../Models/wishListSchema.js";
import ProductDB from "../../Models/productSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";
import { errorHandler } from "../../Middleware/error.js";

//to add product with size to wishlist
export const addToWishlist = async (req, res, next) => {
    try {
        const {productId,size} = req.body;
        const userId = refreshTokenDecoder(req);

        if(!productId || !size) {
            return next(errorHandler(400,"ProductId and size are required"));
        }

        const product = await ProductDB.findById(productId);
        if(!product) return next(errorHandler(404,"Product not found"));

        const variant = product.variants.find(v => v.size === size);
        if(!variant) return next(errorHandler(400,"selected size is not available"));

        //check if wish list exists
        let wishlist = await wishListDB.findOne({user : userId});

        if(!wishlist) {
            wishlist = new wishListDB({user : userId, products :[{productId,size}]});
        }
        else{
            const exists = wishlist.products.some(item =>
                item.productId.toString() === productId && item.size === size
            );
            if(exists) return next(errorHandler(400,"Product with this size is already in the wishlist"));

            wishlist.products.push({productId, size})
        }
        await wishlist.save();
        return res.status(200).json({message : "product added to wishlist",wishlist});
    }catch(error){
       return next(errorHandler(500,"Something went wrong!Please try again"));
    }
}

//to remove product from the wishlist
export const removeFromWishlist = async(req,res,next) => {
    try{
        const {productId, size} = req.body;
        const userId = refreshTokenDecoder(req);

        const wishlist = await wishListDB.findOne({user : userId});
        if(!wishListDB) return next(errorHandler(404,"wishlist not found"));

        wishlist.products = wishlist.products.filter(
            (item) => !(item.productId.toString() === productId && item.size === size)
        );

        await wishlist.save();
        return res.status(200).json({message : "Product removed from wishlist", wishlist});
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong!Please try again"));
    }
}

//to get the user wish list
export const getWishlist = async (req,res,next) => {
    try{
        const userId = refreshTokenDecoder(req);
        if(!userId) return next(errorHandler(404,"user not found"));

        const wishlist = await wishListDB.findOne({user : userId})
         .sort({createdAt : -1})
         .populate("products.productId");

        if(!wishlist) return next(errorHandler(404,"wishlist is empty"));

        return res.status(200).json({message : "wishlist fetched successfully",wishlist});
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong!please try again"));
    }
}