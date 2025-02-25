import axiosInstance from "../axios";

//api call to get sizes
export const getSize = async(req, res) =>{
    try{
        const response = await axiosInstance.get('/admin/size');       
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//api call to add size
export const addSize = async (size) =>{
    try{
        const response = await axiosInstance.post('/admin/add/size',{size});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }

}

//api call to block or unblock the size
export const blockSize = async(id) =>{
    try{
        const response = await axiosInstance.put(`/admin/block-size/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}