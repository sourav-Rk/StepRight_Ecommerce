import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import ProductDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";

//to get place order
export const placeOrder = async(req, res, next) =>{
   
    const {paymentMethod, deliveryAddress, totalAmount} = req.body;
    const userId = req.userId;
    const items = req.cartItems;
    let paymentStatus = "Pending";

    const newOrderDetails ={
        userId,
        deliveryAddress,
        items,
        paymentMethod,
        paymentStatus,
        totalAmount
    }

    try{
        const newOrder = new orderDB(newOrderDetails);
        await newOrder.save();

        const updateTask = [];

        updateTask.push(cartDB.updateOne({userId},{$set : {items:[]}}));

        items.forEach((item) => {
            const productId = item.product._id;
            const quantityPurchased = item.quantity;
            const sizePurchased = item.size;
            updateTask.push(
                ProductDB.updateOne(
                    {_id : productId},
                    {$inc : {'variants.$[v].quantity':-quantityPurchased}},
                    {
                        arrayFilters : [{"v.size" : sizePurchased}],
                        runValidators: true
                    }
                )
            )
        })

        await Promise.all(updateTask)

        res.status(201).json({message : "order placed successfully"})
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong!Please try again"))
    }
}