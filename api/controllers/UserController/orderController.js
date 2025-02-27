import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import ProductDB from "../../Models/productSchema.js";
import { errorHandler } from "../../utils/error.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";


//to get all orders made by a user
export const getUserOrders = async(req, res, next) => {
    try{
        const userId = refreshTokenDecoder(req);
        if(!userId) return next(errorHandler(401,"unauthorized"));

        const orders = await orderDB.find({userId})
        .sort({createdAt : -1})
        .populate({path : "items.product"})

        if(!orders) return next(errorHandler(404,"You havent ordered yet"));

        res.status(200).json({message : "orders fetched successfully",orders});

    }
    catch(error){
        console.error("Error fetching user orders",error);
        return next(errorHandler(500,"Something went wrong! please try again"));
    }
}

//to get a order by its id
export const getOrderById = async(req,res,next) => {
    try{
        const {orderId} = req.params;
        const order = await orderDB.findOne({orderId}).populate({
            path : "items.product",
            populate : {path : 'category',select : 'name -_id'}
        })
        .populate("userId","firstName , email , phone");

        if(!order) return next(errorHandler(404,"Order Not Found"));
        
        return res.status(200).json({order});
    }
    catch(error){
        console.log(error)
        return next(errorHandler(500,"something went wrong! please try again"));
    }
}


//to  place a order
export const placeOrder = async(req, res, next) =>{
   
    const {paymentMethod, deliveryAddress, subtotal,tax, totalAmount} = req.body;
    const userId = req.userId;
    const items = req.cartItems;
    let paymentStatus = "Pending";

    const newOrderDetails ={
        userId,
        deliveryAddress,
        items,
        paymentMethod,
        paymentStatus,
        subtotal,
        tax,
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

        res.status(201).json({message : "order placed successfully",newOrder})
    }
    catch(error){
        return next(errorHandler(500,"Something went wrong!Please try again"))
    }
}

//to cancel an order
export const cancelOrder = async (req, res, next) => {
    try{
        const userId = refreshTokenDecoder(req);
        const {orderId} = req.params;

        const order = await orderDB.findOne({orderId, userId});
        if(!order) return next(errorHandler(404,"Order not found"));

        if(order.status !=="Pending" && order.status !=="Processing") return errorHandler(400,"Order cannot be cancelled at this stage");

        order.status = "Cancelled";
        await order.save();

        const updateTasks = order.items.map((item) => {
            const productId = item.product._id;
            const quantityToRevert = item.quantity;
            const sizePurchased = item.size

            return ProductDB.updateOne(
                {_id : productId},
                {$inc : {"variants.$[v].quantity":quantityToRevert}},
                {
                    arrayFilters : [{"v.size":sizePurchased}],
                    runValidators : true
                }
            )
        })

        await Promise.all(updateTasks);

        res.status(200).json({message : "Order Cancelled Successfully",order});
    }
    catch(error){
        console.log(error);
        return next(errorHandler(500,"Something went wrong! Please try again"));
    }
}

