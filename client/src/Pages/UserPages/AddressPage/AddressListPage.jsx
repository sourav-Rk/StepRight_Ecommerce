import AddressList from "@/components/UserComponent/Address/AddressList";
import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import React from "react";

const AddressListPage = () => {
    return (
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <UserSideBar/>
            <main className="flex-1 overflow-auto p-4">
           <AddressList />
            </main>
          </div>
        </div>
      )
}

export default AddressListPage