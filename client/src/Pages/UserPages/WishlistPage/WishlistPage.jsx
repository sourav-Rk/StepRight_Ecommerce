import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import Wishlist from "@/components/UserComponent/WishList/WishList";
import React from "react";

const  WishlistPage= () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar/>
        <main className="flex-1 overflow-auto p-4">
       <Wishlist />
        </main>
      </div>
    </div>
  )
}
export default WishlistPage