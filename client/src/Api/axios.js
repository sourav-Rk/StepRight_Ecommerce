import { message } from "antd";
import axios from "axios";
import { logout } from "./User/authApi";
import { useDispatch } from "react-redux";
import { store } from "@/Redux/store";
import { useNavigate } from "react-router-dom";
import { UserLogout } from "@/Redux/userSlice";



const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


// interceptor to handle blocked user 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor caught error:", error);
    if (error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    }
    
    if (error.response && error.response.status === 403) {
     
      store.dispatch(UserLogout());
      message.error("Your account has been blocked. Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      },1000);
     
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
