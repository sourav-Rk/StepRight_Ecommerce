import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import WalletMain from "@/components/UserComponent/Wallet/WalletMain";
import React from "react";

const  WalletPage= () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <UserSideBar/>
        <main className="flex-1 overflow-auto p-4">
       <WalletMain />
        </main>
      </div>
    </div>
  )
}
export default WalletPage