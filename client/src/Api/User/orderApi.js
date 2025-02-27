import axiosInstance from "../axios";

//to place the order
export const placeOrder = async (orderData) => {
    try{
        const response = await axiosInstance.post('/users/orders',orderData);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//to get all orders made by the user
export const getUserOrders = async (req, res, next) => {
    try{
        const response = await axiosInstance.get('/users/orders');
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//to get a order details by its id
export const getOrderById = async(id) => {
    try{
        const response = await axiosInstance.get(`users/orders/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//to cancel an order
export const cancelOrder = async(orderId) => {
    try{
        const response = await axiosInstance.patch(`/users/orders/${orderId}/cancel`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

