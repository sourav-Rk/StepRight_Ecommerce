import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { forgotVerifyEmail, forgotVerifyOtp, verifyOtp } from '@/Api/User/authApi';
import { resendOTP } from '@/Api/User/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from "antd";
import "antd/dist/reset.css"; 

const OTPVerificationForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(() => {
    const storedCount = localStorage.getItem('count');
    return storedCount ? parseInt(storedCount) : 60; 
  });
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const formData = location.state?.formData || {}; 

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Check if email is present
  useEffect(() => {
    if (!email) {
      message.error("Email not found. Please try again.");
      navigate("/signup"); 
    }
  }, [email, navigate]);

  // Timer logic
  useEffect(() => {
    let timerInterval;

    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval); 
  }, [timer]);

  // updat localStorage when timer changes
  useEffect(() => {
    localStorage.setItem('count', timer);
  }, [timer]);

  // enable resend button when timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  // clear localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('count'); 
    };
  }, []);

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP({ email, formData });
      if (response?.message) {
        message.success(response.message);
      }
      setTimer(60); 
      setCanResend(false);
    } catch (error) {
      message.error('Failed to send the OTP');
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      message.error('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    
    try {
      let response ;

      if (Object.keys(formData).length > 0) {
        response = await verifyOtp({ email, otp: otpValue });
        
      }
      else{
        response = await forgotVerifyOtp({email,otp});
      }

      
      if (response && response?.message) {
        message.success(response.message || "Verified successfully");
        localStorage.removeItem('count'); 
        setTimeout(() => {
          if (Object.keys(formData).length > 0) {
            navigate("/login"); 
          } else {
            navigate("/reset-password", { state: { email } }); // For forgot password 
          }
        }, 1000);
      }
    } catch (error) {
      message.error(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            Enter Verification Code
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              ))}
            </div>

            <div className="text-center mb-4">
              {timer === 0
                ? <p className='text-sm'>I didn't receive a code. <span onClick={handleResendOTP} className='text-slate-700 font-bold cursor-pointer'>Resend</span></p>
                : <p className='text-sm'>Your OTP expires in: <span className='text-slate-700 font-bold cursor-pointer'>{timer}</span></p>
              }
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
              disabled={loading || timer === 0}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;