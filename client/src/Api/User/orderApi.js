import axiosInstance from "../axios";

//to place the order when cod
export const placeOrder = async (orderData) => {
    try{
        const response = await axiosInstance.post('/users/orders',orderData);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

export const makePayment = async (paymentData) => {
    try {
      const response = await axiosInstance('/users/makePayment', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: paymentData  
      });
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };
  
//to verify the payment
export const verifyPayment = async(paymentDetails) => {
    try{
        const response = await axiosInstance('/users/verifyPayment',{
            method :"POST",
            headers :{
                "Content-Type" : "application/json",
            },
            data : paymentDetails
        });

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

//to get the details of an item in the order
export const getItemDetails = async (orderId, itemId) => {
    try{
        const response = await axiosInstance.get(`/users/orders/${orderId}/item/${itemId}`);
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error;
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

//to cancel a single item in the order
export const cancelSingleItem = async (orderId , itemId) => {
    try {
        const response = await axiosInstance.patch(`/users/orders/${orderId}/item/${itemId}/cancel`);
        return response.data
    }
    catch(error) {
        throw error?.response?.data || error;
    }
}

//to return a item in the order
export const returnItem = async(orderId, itemId, returnReason) => {
    try{
        const response = await axiosInstance.patch(`/users/orders/${orderId}/item/${itemId}/return`,{returnReason});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}


//to return the whole order
// export const returnOrder = async(orderId) => {
//     try{
//         const response = await axiosInstance.patch(`/users/orders/:${orderId}/return`);
//         return response.data
//     }
//     catch(error){
//         throw error?.response?.data || error;
//     }
// }
