import axiosInstance from "../axios";

//Api call for getcategories
export const getCategory = async(page, limit) =>{
   try{
      const response = await axiosInstance.get(`/admin/category?page=${page}?limit=${limit}`);
      return response.data;
   }
   catch(error){
      throw error?.response?.data || error
   }
}

//Api call for add category
export const addCategory = async(data) =>{
     try{
        const response = await axiosInstance.post('/admin/add-category',data);
        return response.data;
     }
     catch(error){
        throw error?.response?.data || error
     }
}

//Api call for block category
export const blockCategory = async (id) =>{
   try{ 
      const response = await axiosInstance.put(`admin/block-category/${id}`);
      return response.data;
   }
   catch(error){
      throw error?.response?.data || error
   }
}

//api call for adding offer
export const addOffer = async(id, offer) =>{
   try{
      const response = await axiosInstance.put(`admin/add-offer/${id}`,{offer});
      return response.data;
   }
   catch(errror){
      throw errror?.response?.data || errror
   }
}

//Api call for editing offer
export const editCategory = async(categoryId, data) =>{
   try{
      const response = await axiosInstance.put(`/admin/edit-category/${categoryId}`,data);
      return response.data
   }
   catch(error){
      throw error?.response?.data || error
   }
}

