import Header from "@/components/UserComponent/LandingPage/Header";
import ItemOrderDetails from "@/components/UserComponent/Order/ItemOrderDetails";
import OrderDetails from "@/components/UserComponent/Order/OrderDetail";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import React from "react";

const  ItemDetailPage= () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar/>
        <main className="flex-1 overflow-auto p-4">
       <ItemOrderDetails />
        </main>
      </div>
    </div>
  )
}
export default ItemDetailPage