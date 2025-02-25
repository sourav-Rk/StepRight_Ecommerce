import { data } from "react-router-dom";
import axiosInstance from "../axios";

//Get brands
export const getBrand = async (page = 1, limit =5) =>{
    try{
        const response = await axiosInstance.get(`/admin/brand?page=${page}?limit=${limit}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || data 
    }
}

//Api call to addd brand
export const addBrand = async (name) =>{
    try{
        const response = await axiosInstance.post('/admin/add-brand',{name});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api call to edit brand
export const editBrand = async(brandInd,name) =>{
    try{
        const response = await axiosInstance.put(`/admin/edit-brand/${brandInd}`,{name});
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api call to block or unblock the brand
export const blockBrand = async (brandInd) =>{
    try{
        const response = await axiosInstance.put(`/admin/block-brand/${brandInd}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data
    }
}