import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/Api/Admin/authApi";
import { useDispatch } from "react-redux";
import { message } from "antd";
import "antd/dist/reset.css"; 
import { UserLogin } from "@/Redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email :"",
    password :""
  });

  const inputChange = (e) =>{
     setFormData({
      ...formData,
      [e.target.name] : e.target.value,
    });
  }


  const handleSubmit = async(e) =>{

      e.preventDefault();

      try{
        
        const response = await loginAdmin(formData);

        message.success(response.message);

        dispatch(UserLogin({name : response.adminName,role : response.role}));

        navigate("/admin/dashboard")
      }
      catch(error){
        message.error(error?.message || "Login Failed. please try again")
      }
  }
  
  return (
    <div className="flex  items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            LOGIN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Email</label>
              <Input
                type="email"
                name ="email"
                placeholder="Enter your email"
                className="w-full"
                value={formData.email}
                onChange={inputChange}
              />
            </div>
            
            {/* Password Field with Eye Icon */}
            <div className="relative">
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pr-10"
                  value={formData.password}
                  onChange={inputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <Button onClick={handleSubmit} className="w-full bg-black dark:bg-white dark:text-black hover:opacity-90">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
