import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { message } from "antd";
import "antd/dist/reset.css"; 
import { useNavigate } from "react-router-dom";
import { signupUser } from "@/Api/User/authApi";
import { validateUser } from "@/Validators/userSignupValidation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referredBy: "", 
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  //to extract referal code from the url
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('ref');
    if(referralCode){
      setFormData((prevData) => ({
        ...prevData,
        referredBy: referralCode,
      }));
    }
  }, [location.search]);

  const inputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    const { error } = validateUser(formData);

    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });

      setErrors(validationErrors);
      // Shake animation on error
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.classList.add("error-shake");
        setTimeout(() => formElement.classList.remove("error-shake"), 500);
      }
      return;
    }
        
    setLoading(true);

    try {
      const response = await signupUser(formData);

      if (response && response.message === "OTP send successfully") {
        // Success animation
        const formElement = document.querySelector("form");
        if (formElement) {
          formElement.classList.add("success-submit");
        }
        
        message.success(response.message);
        setTimeout(() => {
          navigate("/otp", { state: { email: formData.email, formData } });
        }, 800);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setServerError(error.message);
      message.error(error.message || "Signup failed");
      
      // Shake animation on error
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.classList.add("error-shake");
        setTimeout(() => formElement.classList.remove("error-shake"), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f8f9fa] flex items-center justify-center p-4 overflow-y-auto relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.05, scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.03, scale: 1 }}
              transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-10 right-20 w-64 h-64 rounded-full bg-black"
            />
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.02, x: 0 }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-1/3 right-0 w-80 h-40 bg-black"
            />
          </>
        )}
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 py-6 px-4 border-b border-gray-200 bg-white shadow-md z-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
      >
        <motion.h1 
          className="text-2xl font-bold text-center text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            initial={{ letterSpacing: "8px" }}
            animate={{ letterSpacing: "1px" }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative inline-block"
          >
            <motion.span 
              className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 1.5 }}
            />
            StepRight
          </motion.span>
        </motion.h1>
      </motion.header>

      <div className="w-full max-w-md mt-20 mb-16">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Card className="border-2 border-black shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white overflow-hidden">
            {/* Card background animation */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
              {mounted && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "-100%" }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "linear" 
                  }}
                  className="w-full h-[200%] bg-gradient-to-b via-gray-200"
                />
              )}
            </div>
            
            <CardHeader className="pb-2 relative z-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-xl font-extrabold text-center text-black relative">
                  Create Your Account
                  <motion.div 
                    className="h-1 w-0 bg-black mx-auto mt-2"
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </CardTitle>
              </motion.div>
            </CardHeader>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 overflow-hidden"
                >
                  <p className="text-red-500 text-sm text-center font-serif mb-2 p-2 bg-red-50 rounded-md border border-red-200">
                    {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <CardContent>
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  variants={itemVariants}
                >
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-bold text-black">First Name</Label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={inputChange}
                        className="h-8 mt-1 bg-white border-2 border-gray-300 text-black focus:ring-black focus:border-black transition-all duration-300"
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.firstName && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                        >
                          {errors.firstName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-bold text-black">Last Name</Label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={inputChange}
                        className="h-8 mt-1 bg-white border-2 border-gray-300 text-black focus:ring-black focus:border-black transition-all duration-300"
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.lastName && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                        >
                          {errors.lastName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="text-sm font-bold text-black">Email</Label>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={inputChange}
                      autoComplete="username"
                      className="h-8 mt-1 bg-white border-2 border-gray-300 text-black focus:ring-black focus:border-black transition-all duration-300"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="phone" className="text-sm font-bold text-black">Phone</Label>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={inputChange}
                      className="h-8 mt-1 bg-white border-2 border-gray-300 text-black focus:ring-black focus:border-black transition-all duration-300"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div className="relative" variants={itemVariants}>
                  <Label htmlFor="password" className="text-sm font-bold text-black">Password</Label>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      onChange={inputChange}
                      autoComplete="new-password"
                      className="h-8 mt-1 bg-white border-2 border-gray-300 text-black pr-10 focus:ring-black focus:border-black transition-all duration-300" 
                    />
                  </motion.div>
                  <motion.button
                    type="button"
                    className="absolute right-3 top-8 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-950" /> : 
                      <Eye className="h-4 w-4 text-gray-500" />
                    }
                  </motion.button>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div className="relative" variants={itemVariants}>
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-black">Confirm Password</Label>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      value={formData.confirmPassword}
                      onChange={inputChange}
                      autoComplete="new-password"
                      className="h-8 mt-1 bg-white border-2 border-gray-300 text-black pr-10 focus:ring-black focus:border-black transition-all duration-300"
                    />
                  </motion.div>
                  <motion.button
                    type="button"
                    className="absolute right-3 top-8 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-4 w-4 text-gray-950" /> : 
                      <Eye className="h-4 w-4 text-gray-500" />
                    }
                  </motion.button>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-sm mt-1 overflow-hidden"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 relative overflow-hidden group h-10 rounded-md font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2" size={16} />
                          Sign Up
                        </>
                      )}
                    </span>
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-black opacity-20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>

              <motion.p 
                className="mt-3 text-center text-xs text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Already have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link to="/login" className="text-black font-bold hover:underline cursor-pointer">
                    Log in
                  </Link>
                </motion.span>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="fixed bottom-0 left-0 right-0 py-4 px-4 border-t border-gray-200 bg-white shadow-inner z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <motion.p 
          className="text-center text-sm text-black"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          © 2023 StepRight. All rights reserved.
        </motion.p>
      </motion.footer>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes success-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0.2); }
          50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(0,0,0,0.3); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0.2); }
        }
        
        @keyframes error-shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        
        .success-submit {
          animation: success-pulse 0.6s ease-in-out;
        }
        
        .error-shake {
          animation: error-shake 0.5s ease-in-out;
        }
        
        input:focus, button:focus {
          outline: none;
          transition: all 0.3s ease;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}