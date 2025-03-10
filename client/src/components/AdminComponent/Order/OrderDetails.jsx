import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { message,Modal } from "antd";
import { approveRefund, getOrderById, updateSingleItemOrderStatus } from "@/Api/Admin/ordersApi";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const fetchOrder = async () => {
    try {
      const response = await getOrderById(orderId);
      console.log(response)
      setOrder(response.order);
    } catch (error) {
      console.log(error);
      message.error(error?.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  //to handle the status of each item in the order
  const handleStatusChange = async(orderId,itemId,newStatus) => {
     try{
       const response = await updateSingleItemOrderStatus(orderId,itemId,newStatus);
       await fetchOrder();
       message.success(response.message)
     }
     catch(error){
       message.error(error.message)
     }
  }
  
  //to handle approve refund
  const handleApproveRefund = async (orderId, itemId) => {
      try{
        const response = await approveRefund(orderId,itemId);
        await fetchOrder()
        message.success(response.message);
      }
      catch(error){
        message.error(error?.message || "Failed to update the refund status");
      }
  };
  

  //confirmation modal to handle refund status
      const confirmRefund = (orderId,itemId) => {
        Modal.confirm({
          title: "Are you sure you want to confirm this refund",
          content: "This action cannot be undone.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            handleApproveRefund(orderId,itemId);
          },
        });
      };


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "processing":
        return "bg-blue-500 text-white";
      case "shipped":
        return "bg-purple-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

    // Calculate discount from the order totals
    const discount = (order.subtotal + order.tax) - order.totalAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 ml-64">
      <div className="mx-auto max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Order Info</h2>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Ordered Date:</strong> {formatDate(order.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Payment Details</h2>
                <p><strong>Method:</strong> {order.paymentMethod}</p>
                <p className="font-semibold p-2 rounded">
                  Payment Status:{" "}
                  <span
                    className={
                      order.paymentStatus.toLowerCase() === "paid"
                        ? "text-green-800"
                        : "text-red-800"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </p>

                <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                {/* If available, show other payment details */}
              </div>
            </div>

            {/* Customer Details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Customer Details</h2>
              <p><strong>Name:</strong> {order.userId.firstName}</p>
              <p><strong>Email:</strong> {order.userId.email}</p>
              <p><strong>Phone:</strong> {order.userId.phone}</p>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <p>{order.deliveryAddress.fullname}</p>
              <p>{order.deliveryAddress.buildingname}, {order.deliveryAddress.address}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}</p>
              {order.deliveryAddress.landmark && <p><strong>Landmark:</strong> {order.deliveryAddress.landmark}</p>}
            </div>

           {/* Order Items */}
            {/* Order Items */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item._id} className="flex flex-col gap-4 border-b pb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item?.product?.name || "Product"}
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                          <p>Size: <span className="font-medium">{item.size}</span></p>
                          <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 text-sm">
                          <p>Price: <span className="font-medium">₹{item.productPrice.toFixed(2)}</span> each</p>
                          <p>Total: <span className="font-medium">₹{(item.productPrice * item.quantity).toFixed(2)}</span></p>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <select 
                            value={item.status || "Pending"}
                            onChange={(e) => handleStatusChange(orderId, item._id, e.target.value)}
                            className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option 
                              value="Pending" 
                              disabled={item.status !== "Pending" && item.status !== undefined}
                            >
                              Pending
                            </option>
                            <option 
                              value="Processing" 
                              disabled={item.status !== "Pending" && item.status !== "Processing"}
                            >
                              Processing
                            </option>
                            <option 
                              value="Shipped" 
                              disabled={item.status !== "Processing" && item.status !== "Shipped"}
                            >
                              Shipped
                            </option>
                            <option 
                              value="Delivered" 
                              disabled={item.status !== "Shipped" && item.status !== "Delivered"}
                            >
                              Delivered
                            </option>
                            <option 
                              value="Cancelled" 
                              disabled={item.status === "Delivered"}
                            >
                              Cancelled
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-2 py-1 text-xs font-medium rounded-full 
                          ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            item.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            item.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
                            item.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            item.status === 'Returned' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {item.status || 'Pending'}
                        </div>

                        {/* Refund Approval Button or Refunded Badge */}
                        {["Cancelled", "Returned"].includes(item.status) && (
                          <>
                            {item.refundStatus !== "Approved" ? (
                              <button
                                onClick={() => confirmRefund(orderId, item._id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-md shadow-sm transition-all duration-200"
                              >
                                Approve Refund
                              </button>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Refunded
                              </span>
                            )}
                          </>
                        )}
                      </div>                    
                    </div>
                    
                    {/* Return Reason Display */}
                    {item.status === "Returned" && item.returnReason && (
                      <div className="ml-20 mr-4">
                        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-md p-3 shadow-sm">
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-medium text-orange-700 text-sm">Return Reason</h4>
                          </div>
                          <div className="pl-7">
                            <p className="text-gray-700 text-sm italic">"{item.returnReason}"</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>




            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrderDetails;
