import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  TagsIcon,
  PlusCircle,
  ShoppingBag,
  Ticket,
  Star,
  ClipboardList,
  BarChart3,
  Menu,
  LogOutIcon
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AdminLogout } from '@/Redux/adminSlice';
import axiosInstance from '@/Api/axios';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const admin = useSelector((state)=>state.admin.admin)

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]); // Navigate only when `admin` becomes null
  

  const handleLogout = async() => {
    try{
      await axiosInstance.post("/admin/logout");
      dispatch(AdminLogout()); 
    }
    catch(error){
      console.log("failed to logout");
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Customers", icon: Users, path: "/admin/customers" },
    { title: "Category", icon: FolderTree, path: "/admin/category" },
    { title: "Brands", icon: TagsIcon, path: "/admin/brands" },
    { title: "Size", icon: TagsIcon, path: "/admin/size" },
    { title: "Add Product", icon: PlusCircle, path: "/admin/add/products" },
    { title: "Products", icon: ShoppingBag, path: "/admin/products" },
    { title: "Coupon", icon: Ticket, path: "/admin/coupon" },
    { title: "Reviews", icon: Star, path: "/admin/reviews" },
    { title: "Orders", icon: ClipboardList, path: "/admin/orders" },
    { title: "Sales Report", icon: BarChart3, path: "/admin/sales-report" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl transition-all duration-300 z-40
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 border-b">
       <div className="flex items-center space-x-3">
          <img 
            src="/StepRightLogo.png" 
            alt="StepRight Logo" 
            className="w-14 h-14 rounded-full border-2 border-gray-300"
          />
          <span className={`font-bold text-xl transition-opacity duration-200 
            ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
            StepRight
          </span>
        </div>
      </div>


        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                hover:bg-black hover:text-white w-full text-left"
            >
              <item.icon size={24} className="shrink-0" />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg w-full text-left hover:bg-red-200 text-red-500"
          >
            <LogOutIcon size={24} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
