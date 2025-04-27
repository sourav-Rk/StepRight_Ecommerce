import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { loginUser } from "@/Api/User/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { UserLogin } from "@/Redux/userSlice";
import GoogleAuthButton from "@/components/UserComponent/Login/GoogleAuthButton";
import { Eye, EyeOff } from "lucide-react";
import { message } from "antd";
import "antd/dist/reset.css";
import { validateLogin } from "@/Validators/userSignupValidation.js";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
    setIsLoading(true);
    
    // Validate input with Joi
    const { error } = validateLogin(formData);
    if (error) {
      const validationErrors = {};
      error.details.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });

      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await loginUser(formData);
      message.success(response.message);

      dispatch(UserLogin({ name: response?.userName }));
      
      // Add a flourish animation before navigation
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.classList.add("success-submit");
      }
      
      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 800);
    } catch (error) {
      setServerError(error?.message || "Invalid credentials");
      message.error(error?.message || "Login failed! Please try again");
      setIsLoading(false);
      
      // Shake animation on error
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.classList.add("error-shake");
        setTimeout(() => formElement.classList.remove("error-shake"), 500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] relative overflow-hidden">
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
        className="py-6 px-4 border-b border-gray-200 bg-white shadow-md relative z-10"
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

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="border border-black rounded-lg p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white relative overflow-hidden"
            whileHover={{ boxShadow: "0 15px 35px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          >
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
            
            <motion.h2 
              className="text-3xl font-extrabold text-center text-black mb-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Log in to your account
              <motion.div 
                className="h-1 w-0 bg-black mx-auto mt-2"
                initial={{ width: 0 }}
                animate={{ width: "30%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.h2>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-red-500 text-md text-center font-serif mb-4 p-3 bg-red-50 rounded-md border border-red-200">
                    {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form 
              className="space-y-6"
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.7 }
                }
              }}
            >
              <div className="space-y-4">
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <Label htmlFor="email-address" className="font-bold text-black">Email address</Label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={inputChange}
                      className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm transition-all duration-300"
                      placeholder="Email address"
                    />
                  </motion.div>

                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-md mt-1 overflow-hidden"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  className="relative"
                >
                  <Label htmlFor="password" className="font-bold text-black">Password</Label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={inputChange}
                      className="mt-1 block w-full pr-10 border-2 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm transition-all duration-300"
                      placeholder="Password"
                    />
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-10 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-500" />
                    ) : (
                      <Eye size={20} className="text-gray-500" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 font-serif text-md mt-1 overflow-hidden"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <motion.button
                  type="submit"
                  className="w-full bg-black text-white rounded-md py-2 px-4 font-bold relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </span>
                  {!isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-black opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </motion.button>

                <motion.p 
                  onClick={() => navigate("/forgot/verifyEmail")}
                  className="font-medium text-black hover:underline text-center mt-3 font-serif cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                > 
                  Forgot Password?
                </motion.p>
              </motion.div>
            </motion.form>

            <motion.div 
              className="mt-6 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="w-full flex items-center justify-center gap-4">
                <motion.div 
                  className="h-px bg-gray-500 flex-grow"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                />
                <p className="text-black font-medium">OR</p>
                <motion.div 
                  className="h-px bg-gray-500 flex-grow"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GoogleAuthButton />
              </motion.div>
      
              <motion.p
                onClick={() => navigate("/signup")}
                className="font-medium text-black hover:underline cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Don't have an Account? <span className="font-bold">Sign up</span>
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="py-4 px-4 border-t border-gray-200 bg-white shadow-inner relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.p 
          className="text-center text-sm text-black"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2 }}
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
      `}</style>
    </div>
  );
}