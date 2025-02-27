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

