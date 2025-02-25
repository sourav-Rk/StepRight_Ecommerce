import CheckoutPage from "@/components/UserComponent/Checkout/CheckOut";
import Header from "@/components/UserComponent/LandingPage/Header";
import React from "react";

const CheckOutPage = () => {
    return (
        <div className="flex flex-col h-screen">
          <Header/>
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-auto p-4">
           <CheckoutPage />
            </main>
          </div>
        </div>
      )
}
export default CheckOutPage