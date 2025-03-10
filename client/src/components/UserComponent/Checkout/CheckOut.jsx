import { useEffect, useState } from "react"
import OrderSummary from "./OrderSummary"
import DeliveryAddress from "./DeliveyAddress"
import PaymentMethods from "./PaymentMethod"
import PaymentSummary from "./PaymentSummary"
import { proceedToCheckout } from "@/Api/User/cartApi"
import { getAddresses } from "@/Api/User/addressApi"
import {  message } from "antd"
import { makePayment, placeOrder, verifyPayment } from "@/Api/User/orderApi"
import { Button } from "@/components/ui/button"
import OrderSuccessPage from "../Order/OrderSuccessPage"
import CouponSelection from "./CouponSelection"
import { getUserProfile } from "@/Api/User/profileApi"
import { deductWallet } from "@/Api/User/walletApi"


export default function CheckoutPage() {
  // State for selected address & payment
  const [selectedAddress, setSelectedAddress] = useState("1")
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState()
  const [orderSucces,setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [usedCoupons, setUsedCoupons] = useState([]);
  const [walletBalance,setWalletBalance] = useState(0);

  const fetchUsedCoupons = async() => {
    try{
      const response = await getUserProfile();
      setUsedCoupons(response.userDetails.usedCoupons)
      setWalletBalance(response.balance)
    }
    catch(error){
      console.log("Error in fetching the used coupons",error);
    }
  }
  
  //to get addresses
  const fetchAddresses = async () => {
     try{
        const addressResponse = await getAddresses();
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
     fetchUsedCoupons();
  },[]);

  // Calculate subtotal, tax, total
  const subtotal = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  //calculate discount from coupon
  let discountAmount = 0;
  if(appliedCoupon && subtotal >= appliedCoupon.minimumPurchase){
    if(appliedCoupon.discountType === "percentage"){
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else if(appliedCoupon.discountType === "amount"){
      discountAmount = appliedCoupon.discountValue
    }

    discountAmount = Math.min(discountAmount,subtotal);
  }

  const tax = subtotal * 0.12
  const total = Math.round(subtotal - discountAmount + tax);

  //to handle coupons
  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  }


  //handler to place order
  const handlePlaceOrder = async () => {
     const selectedAddressObj = addresses.find(addr => addr._id === selectedAddress);
     if(!selectedAddressObj){
        message.error("Please selece a valid address to continue");
        return;
     }
     if(!selectedPayment){
        message.error("Please selecet a payment method")
        return;
     }
     
     if(selectedPayment ==="cod"){
      const orderData = {
        paymentMethod : selectedPayment,
        deliveryAddress : selectedAddressObj,
        subtotal : subtotal,
        tax : tax,
        discountAmount : discountAmount,
        totalAmount : total,
        couponCode : appliedCoupon ? appliedCoupon.code : null,
     };

      try{
        const response = await placeOrder(orderData);
        message.success(response.message);
        setOrderDetails(response.newOrder)
        setOrderSuccess(true);
    }
      catch(error){
          message.error(error?.message)
          console.log(error)
      }   
  }

  else if(selectedPayment==="wallet"){
     if(walletBalance<total){
      message.error("Insufficient Wallet balance");
      return;
     }
     try{
       const walletResponse = await deductWallet({
        amount : total,
        description : `Payment for order ${selectedAddressObj._id}`
       });
       if(!walletResponse.success){
        message.error(walletResponse.message);
        return;
       }
       const orderData = {
         paymentMethod : selectedPayment,
         deliveryAddress : selectedAddressObj,
         subtotal : subtotal,
         tax : tax,
         discountAmount : discountAmount,
         totalAmount : total,
         couponCode : appliedCoupon? appliedCoupon.code : null,
         paymentStatus : "paid"
       };
       const response = await placeOrder(orderData);
       message.success(response.message);
       setOrderDetails(response.newOrder);
       setOrderSuccess(true)
     }
     catch(error){
      message.error(error?.message);
      console.log(error)

     }
  }

  //if online payment integrate razorpay
  else if(selectedPayment ==="online"){

    try{

      const paymentData = {
        amount : total,
      }

      const razorpayOrder = await makePayment(paymentData);
      console.log("Razorpayorder:",razorpayOrder)
      const options = {
        key : import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount : razorpayOrder.order.amount,
        currency : razorpayOrder.order.currency,
        name : "StepRight",
        description : "Payment for your order",
        order_id : razorpayOrder.order.id,
        handler : async (paymentResponse) => {         
           const verificationResult = await verifyPayment(paymentResponse);
           console.log("verification",verificationResult)
           if(verificationResult.success){
                const orderData = {
                  paymentMethod : selectedPayment,
                  deliveryAddress : selectedAddressObj,
                  subtotal : subtotal,
                  tax : tax,
                  discountAmount : discountAmount,
                  transactionId :paymentResponse.razorpay_payment_id, 
                  paymentStatus : "paid",
                  totalAmount : total,
                  couponCode : appliedCoupon ? appliedCoupon.code : null,
              };

              const response = await placeOrder(orderData);
              message.success(response.message);
              setOrderDetails(response.newOrder);
              setOrderSuccess(true);
           }
           else{
             message.error("Payment verification failed");
           }
        },
        prefill : {
          name : selectedAddressObj.fullname,
          email : selectedAddressObj.email,
          contact : selectedAddressObj.phone || ""
        },
        notes : {
            order_id : razorpayOrder.order.id
          },
          theme : {
            color :  "#3399cc",
          }  
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed",(response) => {
          message.error("Payment failed. Please try again");
        });
        rzp.open();
      }
      catch(error){
        message.error(error?.message);
        console.log(error)

      }
    }
  }
   
    // If order is successful, show the OrderSuccessPage component with order details
    if (orderSucces && orderDetails) {
        return (
          <OrderSuccessPage 
          orderDetails={orderDetails}
          discountAmount={discountAmount}
           />
        );
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

            <CouponSelection 
            subTotal={subtotal} 
            applyCoupon={handleApplyCoupon || []} 
            usedCoupons={usedCoupons}
            />

            <PaymentMethods
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              walletBalance={walletBalance}
              total={total}
            />
            <PaymentSummary
              subtotal={subtotal}
              discount={discountAmount}
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

