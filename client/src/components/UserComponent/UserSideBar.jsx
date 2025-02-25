import React, { useState } from 'react';
import { ChevronRight, User, MapPin, ShoppingBag, Wallet, Heart, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserSideBar = () => {
  const [activeRoute, setActiveRoute] = useState('account');
  const userName = useSelector((state) => state?.user?.user|| "Guest");
  const name = userName.name
  const navigate = useNavigate()

  const menuItems = [
    { icon: <User size={20} />, label: 'Profile', path: '/account' },
    { icon: <MapPin size={20} />, label: 'Address', path: '/address' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/orders' },
    { icon: <Wallet size={20} />, label: 'Wallet', path: '/wallet' },
    { icon: <Heart size={20} />, label: 'Wishlist', path: '/wishlist' },
    { icon: <LogOut size={20} />, label: 'Logout', path: '/logout', isLogout: true },
  ];

  const handleNavigation = (label,path) => {
    setActiveRoute(label);
    navigate(path)
  };

  return (
    <div className="w-64 h-screen bg-white rounded-lg shadow-lg p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {/* User Profile Header */}
      <div className="flex items-center gap-4 p-4 mb-8 border-b hover:bg-gray-50 rounded-md transition-all duration-300 cursor-pointer">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold 
                    transform transition-transform duration-300 hover:scale-110">
          {name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="font-semibold text-lg">{name}</span>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-8">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                onClick={() => handleNavigation(item.label,item.path)}
                className={`w-full flex items-center justify-between p-4 rounded-md transition-all duration-300
                          ${activeRoute === item.label 
                            ? 'bg-black text-white shadow-md transform scale-105' 
                            : item.isLogout
                              ? 'text-gray-700 hover:bg-red-100 hover:text-red-600 hover:shadow-md hover:scale-102'
                              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-102'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`transform transition-transform duration-300 
                              ${activeRoute === item.label ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-base">{item.label}</span>
                </div>
                <ChevronRight 
                  size={18} 
                  className={`transition-transform duration-300
                           ${activeRoute === item.label ? 'rotate-90' : ''}`}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserSideBar;
