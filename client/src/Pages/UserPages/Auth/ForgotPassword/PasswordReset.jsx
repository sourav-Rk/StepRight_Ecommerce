// import React, { useEffect, useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { message } from "antd";
// import "antd/dist/reset.css"; 
// import { forgotChangePassword } from '@/Api/User/authApi';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PasswordReset = ({ onSubmit }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email ;

//   const [formData, setFormData] = useState({
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   //check if there is any email
//   useEffect(()=>{
//     if(!email){
//       navigate("/login")
//     }
//   },[]);

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.confirmPassword) {
//       message.error('Passwords do not match');
//       return;
//     }
//     setLoading(true);
//     try {

//        const response = await forgotChangePassword({email,newPassword:formData.newPassword});

//        message.success(response?.message || "Password changed successfully");
       
//        setLoading(false);

//        setTimeout(() => {
//         navigate("/login")
//        },1000);
       
//     } catch (error) {
//       console.log(error)
//       message.error(error.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md bg-white shadow-lg">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-semibold text-center">
//             Reset Password
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="newPassword" className="text-sm font-medium">
//                 New Password
//               </Label>
//               <Input
//                 id="newPassword"
//                 name="newPassword"
//                 type="password"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className="h-9 bg-white border-gray-200 focus:border-black"
//                 placeholder="Enter new password"
//                 required
//                 autocomplete="new-password"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="text-sm font-medium">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="h-9 bg-white border-gray-200 focus:border-black"
//                 placeholder="Confirm new password"
//                 required
//                 autocomplete="new-password"
//               />
//             </div>

//             <Button 
//               type="submit"
//               className="w-full bg-black text-white hover:bg-gray-800 transition-colors h-9"
//               disabled={loading}
//             >
//               {loading ? "Changing Password..." : "Change Password"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PasswordReset;

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { message } from "antd";
import "antd/dist/reset.css"; 
import { forgotChangePassword } from '@/Api/User/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import Joi from "joi";

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ newPassword: false, confirmPassword: false });

  // Check if email is provided; otherwise, redirect
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Password validation schema
  const passwordSchema = Joi.object({
    newPassword: Joi.string()
      .min(8)
      .pattern(/[A-Za-z]/) // Must contain at least one letter
      .pattern(/\d/) // Must contain at least one digit
      .pattern(/[@$!%*?&]/) // Must contain at least one special character
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base": "Password must contain letters, digits, and special characters (@$!%*?&).",
        "string.empty": "Password is required."
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Confirm Password is required."
      }),
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when user types
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const { error } = passwordSchema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await forgotChangePassword({ email, newPassword: formData.newPassword,confirmPassword:formData.confirmPassword });

      message.success(response?.message || "Password changed successfully");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="h-9 bg-white border-gray-200 focus:border-black pr-10"
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => togglePasswordVisibility("newPassword")}>
                  {showPassword.newPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-9 bg-white border-gray-200 focus:border-black pr-10"
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => togglePasswordVisibility("confirmPassword")}>
                  {showPassword.confirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 transition-colors h-9" disabled={loading}>
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
