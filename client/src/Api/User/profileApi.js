import axiosInstance from "../axios";

export const getUserProfile = async () =>{
    try{
        const response = await axiosInstance.get('/users/profile');
        console.log("profile response:",response)
        return response.data
    }
    catch(error){
        throw error?.response?.data
    }
}

//api call to the edit the profie
export const editProfile = async (formData) => {
    try {
      const response = await axiosInstance.put("/users/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      return response.data;
    } 
    catch (error) {
      throw error?.response?.data || error;
    }
  };