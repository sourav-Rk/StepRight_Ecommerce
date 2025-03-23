import {
  cancelOrder,
  getUserOrders,
  makePayment,
  updatePaymentStatus,
  verifyPayment,
} from "@/Api/User/orderApi";
import { Button } from "@/components/ui/button";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  ShoppingBag,
  Clock,
  Package,
  X,
  ChevronRight,
  Eye,
  ChevronLeft,
} from "lucide-react";
import Invoice from "./Invoice";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch the user's orders
  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders(currentPage, ordersPerPage);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("Error in fetching orders");
      message.error(error?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentPage]);

  // Full order cancellation
  const handleCancel = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      message.success(response.message);
      await fetchUserOrders()
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to cancel order");
    }
  };

  // Confirmation dialog for full order cancellation
  const confirmCancel = (e, orderId) => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: "Are you sure you want to cancel this order?",
      content: "This action cannot be undone.",
      okText: "Yes, Cancel Order",
      okButtonProps: { danger: true },
      cancelText: "No, Keep Order",
      onOk() {
        handleCancel(orderId);
      },
    });
  };

  const handleRetryPayment = async (orderId) => {
    try {
      const order = orders.find((order) => order.orderId === orderId);
      if (!order) {
        return message.error("Order not found");
      }

      const paymentData = { orderId: orderId, amount: order.totalAmount };
      const razorpayOrder = await makePayment(paymentData);

      if (!razorpayOrder || !razorpayOrder.order) {
        return message.error("Failed to create Razorpay order");
      }

      // Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        name: "StepRight",
        description: "Complete your payment",
        order_id: razorpayOrder.order.id,
        handler: async (paymentResponse) => {
          try {
            const verificationResult = await verifyPayment(paymentResponse);

            if (verificationResult.success) {
              message.success("Payment Successful!");
              await updatePaymentStatus(
                orderId,
                paymentResponse.razorpay_payment_id
              );
              fetchUserOrders();
            } else {
              message.error("Payment verification failed");
            }
          } catch (error) {
            message.error(error?.message);
            console.log("Error verifying payment:", error);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      message.error(error?.message);
      console.log("Error initiating payment:", error);
    }
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Processing":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "Shipped":
        return "bg-violet-50 text-violet-700 border border-violet-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <Package className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Processing":
        return <ShoppingBag className="w-4 h-4" />;
      case "Shipped":
        return <Package className="w-4 h-4" />;
      case "Cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-600 font-medium">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            No Orders Yet
          </h2>
          <p className="text-slate-600 mb-8">
            You haven't placed any orders yet. Start exploring our collection!
          </p>
          <Button
            onClick={() => navigate("/shop-all")}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage your purchases</p>
        </div>
        <Button
          onClick={() => navigate("/shop-all")}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order.orderId}`)}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md relative cursor-pointer"
          >
            {/* Order Header */}
            <div className="bg-slate-50 p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h2 className="text-lg font-bold text-slate-800">
                    Order #{order.orderId}
                  </h2>
                  {order.status.toLowerCase() === "cancelled" && (
                    <span
                      className={`${getStatusStyle(
                        order.status
                      )} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Retry Payment Button */}
                {order.paymentStatus === "Failed" &&
                  !order.items.every(
                    (item) =>
                      item.status === "Cancelled" || item.status === "Returned"
                  ) && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryPayment(order.orderId);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white flex items-center text-sm rounded-lg"
                    >
                      Retry Payment
                    </Button>
                  )}
          
                {order.paymentStatus ==="paid" && (
                   <Button
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedOrder(order.orderId);
                     setInvoiceOpen(true);
                   }}
                   className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white flex items-center text-sm rounded-lg"
                 >
                   <Download className="mr-1.5 h-3.5 w-3.5" />
                   Invoice
                 </Button>

                )}
               

                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-slate-500">
                    ORDER TOTAL
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-500">
                    ITEMS (
                    {order.items.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                    )}
                    )
                  </h3>
                  <motion.div
                    className="hidden sm:flex items-center gap-1 text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="w-3 h-3" />
                    Click for details
                  </motion.div>
                </div>

                <div className="md:hidden text-right">
                  <h3 className="text-sm font-medium text-slate-500">TOTAL</h3>
                  <p className="text-lg font-bold">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {order.items.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex flex-col bg-white rounded-lg border border-gray-100 overflow-hidden transition-all hover:border-teal-200 hover:shadow-sm"
                  >
                    {/* Product Image */}
                    <div className="w-full aspect-square overflow-hidden border-b border-gray-100 bg-gray-50 relative">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                      {(item.status === "Cancelled" ||
                        item.status === "Returned") && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <span className="text-xs font-bold text-white uppercase">
                            {item.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-3 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-slate-800 line-clamp-2 text-sm">
                          {item.product?.name || "Product Name"}
                        </h4>
                        {(item.status === "Cancelled" ||
                          item.status === "Returned") && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full text-xs flex-shrink-0">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs text-slate-500 mb-3">
                        <span>Size: {item.size}</span>
                        <span>Qty: {item.quantity}</span>
                        <span className="col-span-2">
                          Price: ₹{item.productPrice?.toFixed(2) || "0.00"}
                        </span>
                      </div>

                      {/* View Details Button */}
                      <div className="mt-auto pt-2">
                        <Link
                          to={`/orders/${order.orderId}/item/${item._id}`}
                          className="w-full px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          View Details
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Order Cancel Button */}
            {
              order.items.every(
                (item) =>
                  item.status === "Pending" || item.status === "Processing"
              ) && (
                <div className="p-5 bg-slate-50 border-t">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmCancel(e, order.orderId);
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium rounded-lg flex items-center gap-2 transition-colors"
                    variant="outline"
                  >
                    <X className="w-4 h-4" />
                    Cancel Full Order
                  </Button>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="flex items-center gap-1 text-slate-700 border-slate-300 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="text-slate-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="flex items-center gap-1 text-slate-700 border-slate-300 hover:bg-slate-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {invoiceOpen && (
        <Modal
          open={invoiceOpen}
          onCancel={() => setInvoiceOpen(false)}
          footer={null}
          width={1000}
          centered
          destroyOnClose
        >
          <Invoice order={selectedOrder} />
        </Modal>
      )}
    </div>
  );
};

export default UserOrders;
