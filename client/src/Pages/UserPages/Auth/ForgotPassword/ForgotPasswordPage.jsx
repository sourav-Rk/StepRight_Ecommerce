  import { forgotVerifyEmail } from "@/Api/User/authApi";
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { useState } from "react";
  import { useNavigate } from "react-router-dom"
  import { message } from "antd";
  import "antd/dist/reset.css"; 

  export default function ForgotPasswordPage() {

    const navigate = useNavigate();

    const [email,setEmail] = useState("");

    const [loading,setLoading] = useState(false);

    const handleChange = (e) =>{
      setEmail(e.target.value);
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();

      if(email.trim()===null || email==="") return toast.error("Email is required")

      if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)===false) return toast.error("Please enter a valid email address in the format: username@domain.com.");
        
      setLoading(true);

      try{
        const response = await forgotVerifyEmail({email});
        console.log("OTP Response:", response);
        message.success(response.message);
        setLoading(false);
        localStorage.removeItem('count');
        navigate("/otp",{state:{email}})
      }
      catch(error){
        console.error("Failed to send OTP Error:", error);
        message.error(error?.message || "Failed to send the OTP");
        setLoading(false)
      }

    }
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="py-6 px-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-black">StepRight</h1>
        </header>

        {/* Main content */}
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="border border-black rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Forgot Password</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email-address">Email address</Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {loading ? "Sending" : "Send Reset Code"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
              <p onClick={()=>navigate("/login")} className="font-medium text-black hover:text-gray-800 cursor-pointer"> 
                  Back to Login
              </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">© 2023 StepRight. All rights reserved.</p>
        </footer>
      </div>
    )
  }

