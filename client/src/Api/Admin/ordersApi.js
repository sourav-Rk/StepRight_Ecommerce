import axiosInstance from "../axios";

//API call to get all orders of the users
export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/admin/orders');
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}


//to get a order details by its id
export const getOrderById = async(id) => {
    try{
        const response = await axiosInstance.get(`admin/orders/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API  call to upate the status of the order
export const updateOrderStatus = async (orderId,newStatus) => {
    try {
        console.log(orderId)
        const response = await axiosInstance.patch(`/admin/orders/${orderId}`,{status: newStatus});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to update the status of a single product in the order
export const updateSingleItemOrderStatus = async(orderId, itemId,newStatus) => {
    try{
        const response = await axiosInstance.patch(`/admin/orders/${orderId}/item/${itemId}`,{status : newStatus});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to update the refund status 
export const approveRefund = async(orderId,itemId) => {
    try{
        const response = await axiosInstance.patch(`/admin/orders/${orderId}/item/${itemId}/refundStatus`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error;
    }
}
