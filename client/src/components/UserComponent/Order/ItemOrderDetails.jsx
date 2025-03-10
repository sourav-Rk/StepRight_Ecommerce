import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { Button } from '@/components/ui/button';
import { getItemDetails, cancelOrder, cancelSingleItem, returnItem } from '@/Api/User/orderApi';
import { CheckCircle, Clock, Package, Truck, Home,Repeat  } from "lucide-react";
import RefundPolicyComponent from './RefundPolicyComponent';
import ReturnReasonModal from './ReturnReasonModal';

const ItemOrderDetails = () => {
  const { orderId, itemId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
 
  //to fetch the order details
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await getItemDetails(orderId, itemId);
      console.log(response);
      setOrder(response.itemDetail);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error(error?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    if (orderId && itemId) {
      fetchOrderDetails();
    }
  }, [orderId, itemId]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  // Status steps for timeline
  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  const getCurrentStatusIndex = (status, lastValidStatus) => {
    if (!status) return -1;
    const formattedStatus = status.toLowerCase();
    // If cancelled, use last valid status for timeline display:
    if (formattedStatus === "cancelled" && lastValidStatus) {
      return statusSteps.findIndex((s) => s.toLowerCase() === lastValidStatus.toLowerCase());
    }
    return statusSteps.findIndex((s) => s.toLowerCase() === formattedStatus);
  };

  // Cancel order handler
  const handleCancel = async () => {
    try {
      const response = await cancelSingleItem(orderId,itemId);
      setOrder(prev => ({
        ...prev,
        itemDetails: { ...prev.itemDetails, status: 'Cancelled' }
      }));
      message.success(response.message);
    } catch (error) {
      console.error(error);
      message.error(error?.message || "Failed to cancel order");
    }
  };

    // Confirmation dialog for deletion
    const confirmDelete = (id) => {
        Modal.confirm({
          title: "Are you sure you want to cancel this Item?",
          content: "This action cannot be undone.",
          okText: "Yes",
          cancelText: "No",
          onOk(){
            handleCancel(id);
          },
        });
      };

      const handleReturnOrder = () => {
        setReturnModalOpen(true);
      };

      const handleReturnSubmit = async(orderId, itemId, returnReason) =>{
        try{
          const response = await returnItem(orderId, itemId, returnReason);
          message.success(response.message);
          await fetchOrderDetails();
          setReturnModalOpen(false);
        }
        catch(error){
          console.log("Error in returning the item",error);
          message.error(error?.message || "Failed to submit return request");
        }
      }
      
      
          //to handle return
        // const handleReturnOrder = async () => {
        //   Modal.confirm({
        //     title: "Are you sure you want to return this item",
        //     content: "Please confirm that you want to return this item",
        //     okText: "Yes,Approve",
        //     cancelText: "Cancel",
        //     okButtonProps: {
        //       className: "bg-black text-white hover:bg-gray-800",
        //     },
        //     onOk: async () => { 
        //       try {
        //         const response = await returnItem(orderId, itemId);
        //         message.success(response.message); 
        //       } catch (error) {
        //         console.error("Return order error:", error);
        //         message.error(error?.message || "Failed to submit return request");
        //       }
        //     },
        //   });
        // };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Order Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/orders">
            <Button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300">
              Back to My Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }
    // Calculate discount amount from order totals (if a coupon was applied)
    const discountAmountDerived = order.subtotal + order.tax - order.totalAmount;
    const effectiveDiscountRate = order.subtotal ? discountAmountDerived / order.subtotal : 0;
    const refundAmount = Math.round(order.itemDetails 
      ? order.itemDetails.productPrice * order.itemDetails.quantity * (1 - effectiveDiscountRate)
      : 0)
      console.log(`discounted amount derive:${discountAmountDerived} effectiveDiscount rate: ${effectiveDiscountRate} refund amount:${refundAmount}`);

  const currentStatusIndex = getCurrentStatusIndex(order.itemDetails.status);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Orders
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Order #{order.orderId}
          </h1>
          <RefundPolicyComponent/>
        </div>
        <div className="bg-white p-2 px-4 rounded-lg shadow-sm border border-gray-200 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ordered on {formatDate(order.orderDate)}</span>
          </div>
          {order.itemDetails.status !== 'Cancelled' && (
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Expected delivery by {formatDate(order.deliveryDate)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Status Timeline - Horizontal */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Order Status</h3>
        <div className="flex items-center w-full">
          {statusSteps.map((status, index) => {
            
            const isCompleted = order.itemDetails.status === "Cancelled" 
              ? false 
              : index <= currentStatusIndex;
            const isCurrent = order.itemDetails.status !== "Cancelled" && index === currentStatusIndex;

            return (
              <div key={status} className="flex-1 relative">
                {index < statusSteps.length - 1 && (
                  <div 
                    className={`absolute top-6 left-1/2 right-0 h-1 ${isCompleted ? "bg-black" : (order.itemDetails.status === "Cancelled" && index === statusSteps.length - 1 ? "bg-red-500" : "bg-gray-300")}`}
                    style={{ width: "calc(100% - 12px)" }}
                  />
                )}
                <div className="flex flex-col items-center relative z-10">
                  <div 
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      isCompleted 
                        ? "bg-black text-white border-black" 
                        : isCurrent
                        ? "bg-white text-black border-black"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    {status === 'Pending' && <Clock size={20} />}
                    {status === 'Processing' && <Package size={20} />}
                    {status === 'Shipped' && <Truck size={20} />}
                    {status === 'Delivered' && <Home size={20} />}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`font-semibold ${isCompleted ? "text-black" : isCurrent ? "text-black" : "text-gray-500"}`}>
                      {status} {isCurrent && <span className="text-xs font-normal text-gray-500">(Current)</span>}
                    </p>
                  </div>
                  <p className={`text-xs mt-1 text-center max-w-[120px] ${isCompleted ? "text-black" : isCurrent ? "text-black" : "text-gray-500"}`}>
                    {status === 'Pending' && 'Order placed and being reviewed'}
                    {status === 'Processing' && 'Order is being processed and packed'}
                    {status === 'Shipped' && 'Order is on the way'}
                    {status === 'Delivered' && 'Order has been delivered'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {order.itemDetails.status === "Cancelled" && (
            <div className="flex-1 relative">
              <div className="flex flex-col items-center relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 bg-red-500 text-white border-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-semibold text-red-500">Cancelled</p>
                </div>
                <p className="text-xs mt-1 text-center max-w-[120px] text-red-500">
                  Order has been cancelled
                </p>
              </div>
            </div>
          )}
          {order.itemDetails.status === "Returned" && (
            <div className="flex-1 relative">
              <div className="flex flex-col items-center relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 bg-green-500 text-white border-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-semibold text-green-500">Returned</p>
                </div>
                <p className="text-xs mt-1 text-center max-w-[120px] text-green-500">
                  Order has been returned
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Information Section */}
      {(order.itemDetails.status === "Cancelled" || order.itemDetails.status === "Returned") && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Refund Information</h2>
          <p className="text-sm text-gray-600">
            Refund Amount: {formatCurrency(refundAmount)}
          </p>
          {order.itemDetails.refundStatus === "Approved" ? (
            <p className="text-sm text-green-600 mt-2">The amount has been credited to your wallet.</p>
          ) : (
            <p className="text-sm text-orange-600 mt-2">
              Your refund request is pending. The amount will be refunded within 3 days after admin approval.
            </p>
          )}
        </div>
      )}


    
      <div className="mt-6 flex justify-end">
        {/* cancel button */}
      {(order.itemDetails.status === "Pending" || order.itemDetails.status === "Processing") && (
          <Button 
            onClick={() => confirmDelete(itemId)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors duration-300"
          >
            Cancel Order
          </Button>
        )}
         
         {/* return button */}
        {order.itemDetails.status === "Delivered" && (
            <Button 
              onClick={handleReturnOrder}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
            >
              <Repeat className="w-5 h-5" />
              Return Item
            </Button>
          )}

        </div>
      

      {/* Item Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Item Details</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="md:w-1/3 flex justify-center">
            <img
              src={order.itemDetails.product.images?.[0] || '/placeholder.svg'}
              alt={order.itemDetails.product.name}
              className="w-full h-auto object-cover rounded-lg border"
            />
          </div>
          {/* Product & Order Details */}
          <div className="md:w-2/3 space-y-6">
            <div>
              <span className="block text-gray-600 text-sm uppercase">Product</span>
              <span className="block text-2xl font-semibold text-gray-800">
                {order.itemDetails.product.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-600 text-sm uppercase">Price</span>
                <span className="block text-lg font-medium text-gray-800">
                  {formatCurrency(order.itemDetails.productPrice)}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 text-sm uppercase">Quantity</span>
                <span className="block text-lg font-medium text-gray-800">
                  {order.itemDetails.quantity}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 text-sm uppercase">Size</span>
                <span className="block text-lg font-medium text-gray-800">
                  {order.itemDetails.size}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 text-sm uppercase">Total Price</span>
                <span className="block text-lg font-medium text-gray-800">
                  {formatCurrency(order.itemDetails.productPrice * order.itemDetails.quantity)}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
              <div>
                <span className="block text-gray-600 text-sm uppercase">Status</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                  ${
                    order.itemDetails.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.itemDetails.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : order.itemDetails.status === "Shipped"
                      ? "bg-purple-100 text-purple-700"
                      : order.itemDetails.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.itemDetails.status}
                </span>
              </div>
              <div>
                <span className="block text-gray-600 text-sm uppercase">Payment</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                  ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.paymentStatus === "Failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Address</h2>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">Shipping Info</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-28 text-sm font-medium text-gray-600">Name:</span>
              <span className="text-sm text-gray-800">{order.deliveryAddress.fullname}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm text-gray-800">{order.deliveryAddress.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-medium text-gray-600">Address:</span>
              <span className="text-sm text-gray-800">
                {order.deliveryAddress.buildingname}, {order.deliveryAddress.address}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-medium text-gray-600">Location:</span>
              <span className="text-sm text-gray-800">
                {order.deliveryAddress.city}, {order.deliveryAddress.district}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </span>
            </div>
            {order.deliveryAddress.landmark && (
              <div className="flex items-center">
                <span className="w-28 text-sm font-medium text-gray-600">Landmark:</span>
                <span className="text-sm text-gray-800">{order.deliveryAddress.landmark}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/orders">
          <Button className="px-6 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100">
            Back to My Orders
          </Button>
        </Link>
      </div>

      <ReturnReasonModal 
      isOpen={returnModalOpen}
      onClose={() => setReturnModalOpen(false)}
      onSubmit={handleReturnSubmit}
      orderId={orderId}
      itemId={itemId}
    />
    </div>
  );
};

export default ItemOrderDetails;
