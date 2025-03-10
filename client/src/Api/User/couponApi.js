import axiosInstance from "../axios";

//API to get all the coupons
export const getCoupons = async() =>{
   try{
    const response = await axiosInstance.get('/users/coupons');
    return response.data;
   }
   catch(error){
    throw error?.response?.data || error
   }
}