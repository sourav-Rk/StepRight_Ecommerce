import axiosInstance from "../axios";

//api call to get the products
export const getProducts = async(page =1, limit = 5) =>{
    try{
        const response = await axiosInstance.get(`/admin/product?page=${page}&limit=${limit}`);
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to get the detail of a particular product
export const getProductEdit = async(id) =>{
    try{
        const response = await axiosInstance.get(`/admin/product-edit/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//product Service
export const productService = {

    uploadImages : async (images) => {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image.file);
        });
        const response = await axiosInstance.post('/admin/upload',formData,{
            headers : {
                'Content-Type' : 'multipart/form-data',
            },
        });        
        return response.data;
    },

    addProduct : async (productData) => {
        try{
            console.log(productData)
            const response = await axiosInstance.post('/admin/add/product',productData);
            return response.data;
        }
        catch(error){
            throw error?.response?.data || error
        }
       
    },

    editProduct : async(id, productData) =>{
        try{
            const response = await axiosInstance.put(`/admin/edit/product/${id}`,productData);
            return response.data
        }
        catch(error){
           
            throw error?.response?.data || error
        }
    },
};

//to block or unblock the product
export const blockProduct = async (id) =>{
    try{
        const response = await axiosInstance.put(`/admin/block-product/${id}`);
        return response.data
    }
    catch(error){
        
        throw error?.response?.data || error
    }
}

//get categories for dropdown
export const getCategoryDropDown = async() =>{
    try{
       const response = await axiosInstance.get(`/admin/product/category`);
       console.log(response)
       return response.data;
    }
    catch(error){
       throw error?.response?.data || error
    }
 }

 //get brands for brands
 export const getBrandsDropDown = async() =>{
    try{
        const response = await axiosInstance.get('/admin/product/brand');
        console.log(response)
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
 }

 //api call to get sizes
export const getSizeDropDown = async(req, res) =>{
    try{
        const response = await axiosInstance.get('/admin/product/size');       
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}


