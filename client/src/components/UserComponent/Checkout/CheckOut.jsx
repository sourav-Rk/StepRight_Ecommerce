import { useEffect, useState } from "react"
import OrderSummary from "./OrderSummary"
import DeliveryAddress from "./DeliveyAddress"
import PaymentMethods from "./PaymentMethod"
import PaymentSummary from "./PaymentSummary"
import { proceedToCheckout } from "@/Api/User/cartApi"
import { getAddresses } from "@/Api/User/addressApi"
import {  message } from "antd"
import { placeOrder } from "@/Api/User/orderApi"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  // State for selected address & payment
  const [selectedAddress, setSelectedAddress] = useState("1")
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState()
  
  //to get addresses
  const fetchAddresses = async () => {
     try{
        const addressResponse = await getAddresses();
        console.log(addressResponse)
        const isDefaultAddress = addressResponse.addresses.find(x => x.isDefault);
        setAddresses(addressResponse.addresses);
        setSelectedAddressIndex(isDefaultAddress);
     }
     catch(error){
        console.log(error);
        message.error(error?.message)
     }
  }

  //to get cart items
  const fetchCartProducts = async () => {
    try{

        const productsResponse = await proceedToCheckout();
        console.log("product",productsResponse)
        setProducts(productsResponse.cart.items || []);
    }
    catch(error){
        console.log(error);
        message.error(error?.message)
    }
     
  }

  useEffect(() => {
     fetchAddresses();
     fetchCartProducts();
  },[]);

  // Calculate subtotal, tax, total
  const subtotal = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  )

  const tax = subtotal * 0.08
  const total = subtotal + tax

  //handler to place order
  const handlePlaceOrder = async () => {
     const selectedAddressObj = addresses.find(addr => addr._id === selectedAddress);
     if(!selectedAddressObj){
        message.error("Please selece a valid address to continue");
     }

     const orderData = {
        paymentMethod : selectedPayment,
        deliveryAddress : selectedAddressObj,
        totalAmount : total
     };

     try{
        console.log(orderData)
        const response = await placeOrder(orderData);
        message.success(response.message);
     }
     catch(error){
        message.error(error?.message)
        console.log(error)
     }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        {/* Main Grid: 2 columns on large screens, 1 column on small */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Order Summary + Delivery Address */}
          <div className="space-y-6 lg:col-span-2">
            <OrderSummary products={products} />
            <DeliveryAddress
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              selectedAddressIndex={selectedAddressIndex}
            />
          </div>

          {/* Right Column: Payment Methods + Payment Summary */}
          <div className="space-y-6">
            <PaymentMethods
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
            <PaymentSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
            <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                    Place Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
