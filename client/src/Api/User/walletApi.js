import axiosInstance from "../axios";

//API call to get the wallet
export const getWallet = async(params) =>{
    try{
        const response = await axiosInstance.get('/users/wallet',{params});
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to deduct the wallet
export const deductWallet = async(amount,description) =>{

   try{
     const response = await axiosInstance.patch('/users/wallet/deduct',amount,description);
     return response.data
   }
   catch(error){
    throw error?.response?.data || error;
   }
}