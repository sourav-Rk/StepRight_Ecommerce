import React, { useEffect, useState } from "react";

import PieChartComponent from "./PieChart";
import SalesFilter from "./SalesFilter";
import { getSalesChartData } from "@/Api/Admin/salesReportApi";
import SalesBarChart from "./SalesChart";
import PieChartProduct from "./PieChartProduct";

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [filter, setFilter] = useState('daily');

  const fetchAnalytics = async () => {
    try {
      const response = await getSalesChartData(filter);
      console.log(response)
      
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  return (
    <div className="p-4 md:p-8 md:ml-10 pt-20 min-h-screen">

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl">
              ₹{analyticsData?.totals.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl">{analyticsData?.totals.totalOrders || 0}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sales Overview</h2>
            <SalesFilter onFilterChange={setFilter} />
          </div>
          <SalesBarChart salesData={analyticsData?.sales} />
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Categories</h2>
            <PieChartComponent data={analyticsData?.categories} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Brands</h2>
            <PieChartComponent data={analyticsData?.brands} />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
            <PieChartProduct data={analyticsData?.topProducts} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;