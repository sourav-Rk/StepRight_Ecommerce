// GoogleAuthButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '@/Firebase/fireBase.js'
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { UserLogin } from "@/Redux/userSlice";
import { loginWithGoogle } from "@/Api/User/authApi";
import { message } from "antd";
import "antd/dist/reset.css"; 
const GoogleAuthButton = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async()=>{
    try{
       const result =  await signInWithPopup(auth,googleProvider)
       const response = await loginWithGoogle(result?.user.displayName,result?.user.email);
        if(response.success)
        {
          navigate('/')
        }
        message.success(response.message)
        dispatch(UserLogin({name:result?.user.displayName,email:result?.user.email,role : "user"}))
    }
    catch(err){
        message.error(err.message)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full bg-black hover:bg-gray-800 text-white"
    >
       <FaGoogle size={24} />
      Sign in with Google
    </Button>
  );
};

export default GoogleAuthButton;
