import orderDB from "../../Models/orderSchema.js";
import { errorHandler } from "../../utils/error.js";

//to get all orders made by the user
export const getAllOrders = async (req, res, next) =>{
    try{
        const orders = await orderDB.find({})
          .sort({createdAt:-1})
          .populate("userId","firstName , email , phone");

        if(!orders || orders.length ===0){
            return next(errorHandler(404,"No orders found"));
        }  

        res.status(200).json({message : "orders fetched successfully",orders})
    }
    catch(error){
        console.error("Error fetching orders for admin:",error);
        return next(errorHandler(500,"something went wrong! Please try again"));
    }
};

//to change the status of the order
export const updateOrderStatus = async (req,res,next) => {
   try {
    const {orderId} = req.params;
    const {status : newStatus} = req.body;

    if(!newStatus) return next(errorHandler(400,"Status is required"));
   
    //check the newstatus is one of the allowed statuses
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if(!allowedStatuses.includes(newStatus)) {
      return next(errorHandler(400,"Invalid status value"));
    }
    
    const order = await orderDB.findOne({orderId});
    if(!order) return next(errorHandler(404,"Order not found"));
    
    const allowedTransitions = {
      Pending : ["Processing","Cancelled"],
      Processing : ["Shipped","Cancelled"],
      Shipped : ["Delivered"],
      Delivered : [],
      Cancelled : []
    }
    
    //check if the new status is allowed
    if(!allowedTransitions[order.status].includes(newStatus)){
      return next(errorHandler(400,`Cannot change status from ${order.status} to ${newStatus}`));
    }
    order.status = newStatus;
    await order.save();
                                                                                                                                                                                                                                         
    res.status(200).json({message : "Order status updated successfully",order });
  }
  catch(error){
    console.log("Error in updating status",error);
    return next(errorHandler(500,"Something went wrong!Please try again"));
  }
}