import axiosInstance from "../axios";

//API call to get the coupons
export const getCoupons = async() =>{
    try{
        const response = await axiosInstance.get('/admin/coupon');
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to add the coupon
export const addCoupon = async(data) =>{
    try{
        const response = await axiosInstance.post('/admin/coupon',data);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to block or unblock the status
export const blockCoupon = async(id) => {
    try{
        const response = await axiosInstance.put(`/admin/coupon/${id}`);
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}
