import axiosInstance from "../axios";

//Api call for fetching sneakers
export const getSneakers = async() =>{
    try{
        const response = await axiosInstance.get('/users/products/sneakers');
        console.log(response);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api cal for fetching categories to display
export const getCategoriesToDisplay = async() => {
    try {
        const response = await axiosInstance.get('/users/categories');
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api call for fetching specific category products
export const getProductsByCategory = async (categoryId, page, limit) => {
    try{
        const response = await axiosInstance.get(`/users/category/${categoryId}`, {
            params: {
              page,
              limit,
            },
          });
          
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error;
    }
}


//Api call for fetching all products 
export const getProducts = async (page, limit) =>{
    try{

        const response = await axiosInstance.get(`/users/products/shopall?page=${page}?limit=${limit}`);
        console.log(response)
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
    
}

//Api call for fetching a particular product
export const getProductDetails = async(id) =>{
    try{
        const response = await axiosInstance.get(`/users/products/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api call for fetching the related products
export const getRelatedProducts = async (categoryId, currentProductId)=>{
    try{
        const response = await axiosInstance.get(`/users/products/related?category=${categoryId}&exclude=${currentProductId}`);
        return response.data
    }
    catch(error){
     throw error?.response?.data || error
    }
}






// //Api call for fetching sneakers for category product page
// export const getSneaker = async(page, limit) =>{
//     try{
//         const response = await axiosInstance.get(`/users/products/sneaker?page=${page}?limit=${limit}`);
//         return response.data;
//     }
//     catch(error){
//         throw error?.response?.data || error
//     }
    
// }


// //Api call for fetching sneakers for category product page
// export const getRunningShoe = async(page, limit) =>{
//     try{
//         const response = await axiosInstance.get(`/users/products/runningShoes?page=${page}?limit=${limit}`);
//         return response.data;
//     }
//     catch(error){
//         throw error?.response?.data || error
//     }
    
// }
// //Api call for fetching sneakers for category product page
// export const getHighTop = async(page, limit) =>{
//     try{
//         const response = await axiosInstance.get(`/users/products/highTops?page=${page}?limit=${limit}`);
//         return response.data;
//     }
//     catch(error){
//         throw error?.response?.data || error
//     }
    
// }
