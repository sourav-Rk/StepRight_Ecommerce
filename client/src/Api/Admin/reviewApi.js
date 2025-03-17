import axiosInstance from "../axios";

//to get the reviews 
export const getReviews = async(queryParams) => {
    try{
        const response = await axiosInstance.get(`/admin/reviews?${queryParams}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}