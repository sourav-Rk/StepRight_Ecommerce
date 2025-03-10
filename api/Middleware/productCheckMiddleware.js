import cartDB from "../Models/cartSchema.js";
import {refreshTokenDecoder} from "../utils/jwtToken/decodeRefreshToken.js"
import { errorHandler } from "./error.js";
import ProductDB from "../Models/productSchema.js";

export const validateProduct = async(req, res, next) => {
    try{
        const userId = refreshTokenDecoder(req);


        let items = [];
     
        //finding the cart of the user
        const cart = await cartDB.findOne({userId}).populate({path:'items.product',populate:{path:'category',select:'name -_id'}});
        items = cart.items;
        if(!cart) return next(errorHandler(404,"cart not found"));
        if(items.length === 0) return next(errorHandler(400,"cart is empty"));

        for(const item of items){
            const sizeObject = item?.product?.variants.find(v => v.size === item?.size);
             if(!item?.product?.isActive){
                return next(errorHandler(400,"some of your cart items is currently unavailable now"));
             }
             else if(sizeObject.quantity<item.quantity){
                return next(errorHandler(400,"some of your cart products out of stock now"))
             }
        };
        
        for (const item of items) {
            const product = await ProductDB.findOne(
                { _id: item.product._id, "variants.size": item.size },
                { "variants.$": 1 }
            );

            if (!product || product.variants.length === 0) {
                return res.status(400).json({ message: `Product ${item.product.name} not found.` });
            }

            const availableQuantity = product.variants[0].quantity;

            if (availableQuantity <= 0) {
                return res.status(400).json({ message: `Product ${item.product.name} is out of stock.` });
            }

            if (availableQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Only ${availableQuantity} units of ${item.product.name} are available.`,
                });
            }
        }


        req.userId = userId;

        req.cartItems = items.map((item) => {
            return {
                product : item.product._id,
                productPrice:item.price,
                size : item.size,
                quantity : item.quantity
            }
        });
        next()
    }
    catch(error){
        return next(errorHandler(500,"something went wrong during product checking"))    }
}