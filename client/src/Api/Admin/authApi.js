import axiosInstance from "../axios";

export const loginAdmin = async(adminData) =>{
    try{
        const response = await axiosInstance.post('/admin/login',adminData);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}