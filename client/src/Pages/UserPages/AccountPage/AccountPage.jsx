import PersonalInformation from "@/components/UserComponent/Account/PersonalInformation";
import Header from "@/components/UserComponent/LandingPage/Header";
import UserSideBar from "@/components/UserComponent/UserSideBar";
import React from "react";

const AccountPage = () =>{
    return (
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <UserSideBar/>
            <main className="flex-1 overflow-auto p-4">
           <PersonalInformation />
            </main>
          </div>
        </div>
      )
}

export default AccountPage