import Header from "@/components/UserComponent/LandingPage/Header";
import OrderDetails from "@/components/UserComponent/Order/OrderDetail";
import UserOrders from "@/components/UserComponent/Order/UserOrders";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import React from "react";

const  OrderDetailPage= () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar/>
        <main className="flex-1 overflow-auto p-4">
       <OrderDetails />
        </main>
      </div>
    </div>
  )
}
export default OrderDetailPage