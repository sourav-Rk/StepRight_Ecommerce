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

