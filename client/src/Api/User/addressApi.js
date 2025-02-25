import axios from "axios";
import axiosInstance from "../axios";

//API call to get all the addresses
export const getAddresses = async() =>{
    try{
        const response = await axiosInstance.get('/users/address');
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to get a particular address
export const getAddress = async(id) => {
    try{
        const response = await axiosInstance(`/users/address/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to add the address
export const addAddress = async(formData) => {
    try{
        const response = await axiosInstance.post('/users/address',formData);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//Api call to edit the address
export const editAddress = async(id,formData) => {
    try{
        console.log(id)
        const response = await axiosInstance.put(`/users/address/${id}`,formData);
        console.log(response)
        return response.data
    }
    catch(error){
        console.log(error)
        throw error?.response?.data || error
    }
}

//API call to delete an address
export const deleteAddress = async(id) =>{
    try{
        const response = await axiosInstance.delete(`/users/address/${id}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to set the address as default
export const setAsDefault = async(id) => {
    try{
        const response = await axiosInstance.patch(`/users/address/${id}`);
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error;
    }
}


