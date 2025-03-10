import cartDB from "../../Models/cartSchema.js";
import orderDB from "../../Models/orderSchema.js";
import ProductDB from "../../Models/productSchema.js";
import { errorHandler } from "../../Middleware/error.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";
import usersDB from "../../Models/userSchema.js";
import CouponDB from "../../Models/couponSchema.js";
import dayjs from "dayjs";
import walletDB from "../../Models/walletSchema.js";


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

//to get the details of a an item in the order
export const getOrderByItemId = async (req,res,next) =>{
    try{
        const {orderId,itemId} = req.params;

        const order = await orderDB.findOne({orderId}).populate("items.product");;

        if(!order) return next(errorHandler(404,"Order not found"));

        const item = order.items.find( i =>i._id.toString() === itemId);

        if(!item) return next(errorHandler(404,"Item not found in the order"));

        const itemDetail = {
            orderId : order.orderId,
            deliveryAddress : order.deliveryAddress,
            itemDetails : {
                product : item.product,
                productPrice : item.productPrice,
                size : item.size,
                quantity : item.quantity,
                status : item.status,
                refundStatus : item.refundStatus
            },
            subtotal : order.subtotal,
            tax : order.tax,
            totalAmount : order.totalAmount,
            paymentStatus : order.paymentStatus,
            deliveryDate : order.deliveryDate,
            orderDate : order.createdAt
        }
        res.status(200).json({message : "item details fetched successfully",itemDetail})
    }
    catch(error){
       return next(errorHandler(500,"something went wrong!please trffdfy again"))
    }
}

//to  place a order
export const placeOrder = async(req, res, next) =>{
   
    const {paymentMethod, deliveryAddress, subtotal,tax, totalAmount, paymentStatus,transactionId,couponCode,discountAmount} = req.body;
    console.log(req.body);
    console.log("discount amount:",discountAmount)
    const userId = req.userId;
    const items = req.cartItems;

    const user = await usersDB.findById(userId);
    if(!user) return next(errorHandler(404,"User not found"));

    let coupon = null;
    if(couponCode) {
        coupon = await CouponDB.findOne({code : couponCode});
        if(!coupon) return next(errorHandler(404,"Invalid coupon code"));
    
    //check if the user has already used this coupon
    if(user.usedCoupons.includes(coupon._id)){
        return next(errorHandler(400,"You have already used this coupon"));
    }
  }


    const newOrderDetails ={
        userId,
        deliveryAddress,
        items,
        paymentMethod,
        paymentStatus,
        transactionId,
        subtotal,
        tax,
        discountAmount,
        couponCode,
        totalAmount
    }

    try{
        const newOrder = new orderDB(newOrderDetails);
        await newOrder.save();

        if(coupon){
            await usersDB.findByIdAndUpdate(userId,{$push : {usedCoupons : coupon._id}});
        }

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

        //to update the status of each item in the order to cancelled
        order.items.forEach((item) => {
            item.status = "Cancelled";
        });
        
        //to update the refund status of each item in the order to pending
        order.items.forEach((item) => {
            item.refundStatus = "Pending";
        })

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


//to cancel a single order
export const cancelSingleItem = async (req, res, next) =>{
    try{
        const userId = refreshTokenDecoder(req);
        const {orderId, itemId} = req.params;

        const order = await orderDB.findOne({orderId,userId});
        if(!order) return next(errorHandler(404,"Order not found"));

        const item = order.items.id(itemId);
        if(!item) return next(errorHandler(404,"Order item not found"));

        if(item.status !=="Pending" && item.status !=="Processing") return next(errorHandler(400,"Order cannot be cancelled at this stage"));
        
        item.status = "Cancelled";
        item.refundStatus="Pending";
        await order.save();

        const productId = item.product;
        const quantityToRevert = item.quantity;
        const sizePurchased = item.size;

        await ProductDB.updateOne(
            {_id : productId},
            {$inc : {"variants.$[v].quantity" : quantityToRevert}},
            {
                arrayFilters : [{"v.size" : sizePurchased}],
                runValidators : true
            }
        );

        return res.status(200).json({message : "Ordered  item is cancelled"});
    }
    catch(error){
        console.log("Error in cancelling the item",error)
        return next(errorHandler(500,"Something went wrong!Please try again"));
    }
}

//to return a order
export const returnItem = async (req, res, next) => {
    try{
        const userId = refreshTokenDecoder(req);
        const {orderId,itemId} = req.params;
        const {returnReason} = req.body;
        console.log(returnReason)

        const order = await orderDB.findOne({orderId,userId});
        if(!order) return next(errorHandler(404,"Order not found"));

        const item =  order.items.id(itemId);
        if(!item) return next(errorHandler(404,"order item not found"));

        if(item.status === "Returned") return next(errorMonitor(400,"Item has already been returned"));

        if(item.status !=="Delivered") return next(errorHandler(400,"Item cannot be returned before delivery"));

        const deliveryDate = dayjs(order.deliveryDate);
        const returnDeadline = deliveryDate.add(7, "day");
        if(dayjs().isAfter(returnDeadline)){
            return next(errorHandler(400,"Return window has expired. Items can only be returned within 7 days of delivery."));
        }

        item.status = "Returned";
        item.returnReason = returnReason;
        item.refundStatus="Pending";
        
        await order.save();

        const productId = item.product;
        const quantityToRevert = item.quantity;
        const sizePurchased = item.size;

        await ProductDB.updateOne(
            {_id : productId},
            {$inc : {"variants.$[v].quantity" : quantityToRevert}},
            {
                arrayFilters : [{"v.size" : sizePurchased}],
                runValidators : true
            }
        );
        
        return res.status(200).json({message : "Item return processed successfully"});

    }
    catch(error){
        return next(errorHandler(500,"Something went wrong"));
    }
}


//to return the whole order

// export const returnOrder = async (req, res, next) => {
//     try{
//         const userId = refreshTokenDecoder(req);
//         const {orderId} = req.params;

//         const order = await orderDB.findOne({orderId, userId});
//         if(!order) return next(errorHandler(404,"Order not found"));

        
//         if(order.status === "Returned") return next(errorMonitor(400,"Items has already been returned"));

//         if(order.status !=="Delivered") return next(errorHandler(400,"Items cannot be returned before delivery"));

//         order.status = "Returned";

//         //to update the status of each item in the order to cancelled
//         order.items.forEach((item) => {
//             item.status = "Returned";
//         });

//         await order.save();

//         const updateTasks = order.items.map((item) => {
//             const productId = item.product._id;
//             const quantityToRevert = item.quantity;
//             const sizePurchased = item.size

//             return ProductDB.updateOne(
//                 {_id : productId},
//                 {$inc : {"variants.$[v].quantity":quantityToRevert}},
//                 {
//                     arrayFilters : [{"v.size":sizePurchased}],
//                     runValidators : true
//                 }
//             )
//         })

//         await Promise.all(updateTasks);

//         res.status(200).json({message : "Order Cancelled Successfully",order});
//     }
//     catch(error){
//         console.log(error);
//         return next(errorHandler(500,"Something went wrong! Please try again"));
//     }
// }