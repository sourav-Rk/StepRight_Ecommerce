import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {logout} from "@/Api/User/authApi.js"
import { UserLogout } from "@/Redux/userSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(UserLogout());
      message.error("Your account has been blocked. Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return handleLogout;
};

export default useLogout;
