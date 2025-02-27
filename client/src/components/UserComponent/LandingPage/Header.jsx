import React, { useEffect, useState } from "react";
import {
  Home,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { logout } from "@/Api/User/authApi";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout } from "@/Redux/userSlice";
import { useNavigate } from "react-router-dom"; 
import { message } from "antd";
import "antd/dist/reset.css"; 
import { getCategoriesToDisplay } from "@/Api/User/productApi";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  // access the state from Redux
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // use useNavigat for  navigation
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  useEffect(() =>{
    const fetchCategories = async() =>{
      try{
        const response = await getCategoriesToDisplay();
        console.log("sdfgjas",response)
        setCategories(response.categories);
      }
      catch(error){
        console.log("error in fetching categories",error)
      }          
    }
    fetchCategories()
  },[]);
   
  //handle logout
  const handleLogout = async () => {
    try {
      const response = await logout();
      message.success(response.message);
      dispatch(UserLogout());
      navigate("/login"); 
    } catch (error) {
      message.error("Failed to logout");
    }
  };

  //function to handle navigation when clicking the wishlist and cart button
  const handleProtectedNavigation = () => {
     if(!isLoggedIn){
       message.error("You are not logged in . Please login to continue");
       setTimeout(() =>{
        navigate("/login")
       },500) 
     }
     else{
      navigate("/cart")
     }
  }

  const handleNavigationIcons =() =>{
    navigate("/login")
  }

  // functin to handle navigation
  const handleNavigation = (id) => {
    if (id) {
      if (id === "shopall") {
        navigate("/shop-all");
      } else {
        navigate(`/category/${id}`);
      }
    } else {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-black text-white shadow-md">
      <div className="flex items-center justify-between w-full p-4">
        {/* Logo and Website Name */}
        <div className="flex items-center">
          <img
            src="/StepRightLogo.png"
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full border-2 border-white"
          />
          <span className="text-xl font-bold ml-7">StepRight</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavigation()}
            className="hover:text-gray-300"
          >
            Home
          </button>

          {categories.map((category) => (
            <button
              key={category._id} // Use category_id as the key
              onClick={() => handleNavigation(category._id)}
              className="hover:text-gray-300"
            >
              {category.name}
            </button>
          ))}
          
          <button
            onClick={() => handleNavigation("shopall")}
            className="hover:text-gray-300"
          >
            Shop All
          </button>
        </nav>

        {/* Icons & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
         
          <button onClick={() => handleProtectedNavigation()} className="hover:text-gray-300">
            <Heart size={20} />
          </button>
          <button onClick={() => handleProtectedNavigation()} className="hover:text-gray-300">
            <ShoppingBag size={20} />
          </button>

          {/* User Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                className="flex items-center space-x-2 hover:text-gray-300"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User size={20} />
                <span className="hidden md:inline text-sm">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigationIcons()}
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <User size={20} />
              </button>
            )}

  
           {/* Desktop User Dropdown */}
            {isLoggedIn && userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-md shadow-lg py-1">
              {/* Add Profile button first */}
              <button
                onClick={() => navigate("/account")}
                className="flex items-center space-x-2 px-4 py-2 text-sm w-full hover:bg-gray-800"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm w-full hover:bg-gray-800 border-t border-gray-800"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden hover:text-gray-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden w-full bg-black border-t border-gray-800">
          <div className="flex flex-col space-y-3 p-4">
            <button
              onClick={() => handleNavigation()}
              className="hover:text-gray-300 text-left"
            >
              Home
            </button>
            
            {categories.map((category) => (
            <button
              key={category._id} // Use category_id as the key
              onClick={() => handleNavigation(category._id)}
              className="hover:text-gray-300 text-left"
            >
              {category.name}
            </button>
            ))}
            <button
              onClick={() => handleNavigation("shopall")}
              className="hover:text-gray-300 text-left"
            >
              Shop All
            </button>

            
            {isLoggedIn && (
              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <User size={16} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>

                {/* Profile Button */}
                <button
                  onClick={() => navigate("/account")}
                  className="flex items-center space-x-2 text-sm text-white hover:text-gray-300 mt-2"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;