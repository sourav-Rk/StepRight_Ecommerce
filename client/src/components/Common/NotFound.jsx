import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () =>{
     if(location.pathname.startsWith("/admin")){
        navigate("/admin/dashboard")
     }
     else{
        navigate("/")
     }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={handleNavigate} 
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;