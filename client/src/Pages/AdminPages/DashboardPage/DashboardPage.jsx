import Dashboard from "@/components/AdminComponent/Dashboard/Dashboard.jsx";
import Sidebar from "@/components/AdminComponent/Sidebar";
import React from "react";

const DashboardPage = () =>{
    return (
        <div className="relative">
          <Sidebar />
          <main className="md:ml-64">
            <Dashboard />
          </main>
        </div>
      );
}

export default DashboardPage