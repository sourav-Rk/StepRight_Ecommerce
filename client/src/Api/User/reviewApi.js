import axiosInstance from "../axios";

//to post a review
export const addReview = async (productId,rating,reviewText) => {
  try{
    const response = await axiosInstance.post('/users/review',{productId,rating,reviewText});
    return response.data;
  }
  catch(error){
    throw error?.response?.data || error ;
  }
}


//to get the reviews 
export const getReviews = async(productId) => {
    try{
        const response = await axiosInstance.get(`/users/review/${productId}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}