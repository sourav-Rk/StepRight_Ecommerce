import axiosInstance from "../axios"

//api call for verify login
export const loginUser = async (userData) =>{
    try{
        const response = await axiosInstance.post("/users/login",userData, {withCredentials : true});
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//api call for signup
export const signupUser = async (userData) =>{
    try{
        const response = await axiosInstance.post('/users/signup',userData);
        return response.data;
    }
    catch(error){
        if(!error.response){
            throw error
        }
        else{
         throw error?.response.data || error ;
        }
    }
}

//api call to verify the otp
export const verifyOtp = async({email,otp}) => {
    try{
        const response = await axiosInstance.post('/users/signup/otp', {email, otp}) ;
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error;
    }
    
}

//api call to resend the otp
export const resendOTP = async({email,formData}) =>{
    try{
        const response = await axiosInstance.post('/users/signup/resend-otp',{email,formData});
        return response.data;
    }
    catch(error){
        throw error?.response?.data || error ;
    }
}

//api call to verify the email for forgot password
export const forgotVerifyEmail = async({email}) => {
    try{
        const response = await axiosInstance.post('/users/forgot/verify-email',{email}) ;
        return response.data;
    }
    catch(error){
        console.error("OTP Send Error:", error.response?.data || error.message);
        throw error?.response?.data || error ;
    }
}

//api call to verify the otp for forgot password
export const forgotVerifyOtp = async({email, otp}) =>{
    try{
        const response = await axiosInstance.post('/users/forgot/verify-otp',{email, otp});
        return response.data;
    }
    catch(error){
        console.error("Failed to verify the OTP",error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "OTP verification failed. Please try again.");
    }
}

//api call to change password
export const forgotChangePassword = async({email,newPassword}) =>{
    try{
        const response = await axiosInstance.patch("/users/forgot/change-password",{email,newPassword});
        return response.data
    }
    catch(error){
        throw error?.response?.data?.message || error;
    }
}

//sign in with google
export const loginWithGoogle = async(name,email)=>{
    try{
        const response = await axiosInstance.post('/users/googleLogin',{name,email})
        return response.data
    }
    catch(error)
    {
        throw error?.response?.data || error;
    }
}

//api call to logout
export const logout = async () => {
    try{
        const response = await axiosInstance.post('/users/logout');
        return response.data;
    }
    catch(error){
        
        throw error?.response?.data || error
       
    }
}