import axios from "axios";
import axiosInstance from "../axios";

//Api call for fetching sneakers
export const getSneakers = async() =>{
    try{
        const response = await axiosInstance.get('/users/products/sneakers');
        console.log(response)
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


//Api call for fetching a particular product
export const getProductDetails = async(id) =>{
    try{
        const response = await axiosInstance.get(`/users/products/${id}`);
        console.log("product details",response)
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

//API call for advanced search
export const advancedSearch = async (filtersObj) => {
    try {
      const { sortBy, page, limit, categoryId, categories, brands,name } = filtersObj;
      let url = `/users/advancedSearch?page=${page}&limit=${limit}&sortBy=${sortBy}`;
      
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      if (categories) {
        // If categories is an array, join it; otherwise, assume it's already a comma separated string.
        const categoriesParam = Array.isArray(categories) ? categories.join(",") : categories;
        url += `&categories=${categoriesParam}`;
      }
      if (brands) {
        const brandsParam = Array.isArray(brands) ? brands.join(",") : brands;
        url += `&brands=${brandsParam}`;
      }

      
    if (name) {
        url += `&name=${encodeURIComponent(name)}`; // Encode the search term for URL safety
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };
  