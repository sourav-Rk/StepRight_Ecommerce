import { cancelOrder, getUserOrders } from '@/Api/User/orderApi';
import { Button } from '@/components/ui/button';
import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {Download} from "lucide-react"
import Invoice from './Invoice';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const response = await getUserOrders();
        setOrders(response.orders);
      } catch (error) {
        console.log("Error in fetching orders");
        message.error(error?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  // Full order cancellation
  const handleCancel = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      message.success(response.message);
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

  // Function to get status badge style (for additional use)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-lg text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Button 
            onClick={() => navigate('/shop-all')} 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
        <Button 
          onClick={() => navigate('/shop-all')} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue Shopping
        </Button>
      </div>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div 
            key={order._id} 
            onClick={() => navigate(`/orders/${order.orderId}`)} 
            className="border rounded-lg shadow-sm overflow-hidden bg-white transition-all duration-300 hover:shadow-md relative cursor-pointer"
          >
     {/* Order Header */}
      <div className="bg-gray-50 cursor-pointer p-4 border-b flex flex-col md:flex-row justify-between md:items-center gap-3 relative">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">Order #{order.orderId}</h2>
            {order.status === "Cancelled" && (
              <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-xs">
                Cancelled
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Invoice Button - Positioned to top-right */}
        <Button 
        onClick={(e)=>{
          e.stopPropagation();
          setSelectedOrder(order.orderId);
          setInvoiceOpen(true);

        }}
        className="absolute top-4 right-4 px-3 py-1 bg-black hover:bg-gray-800 text-white flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Invoice
        </Button>

        <motion.p
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Click to see the full order details
        </motion.p>
      </div>

            {/* Order Content */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  ITEMS ({order.items.reduce((total, item) => total + (item.quantity || 0), 0)})
                </h3>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-500">ORDER TOTAL</h3>
                  <p className="text-lg font-bold">₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
  
              {/* Vertical Item Layout */}
              <div className="space-y-4 border rounded-md p-3 bg-gray-50">
                {order.items.map((item, index) => (
                  <div key={item._id || index} className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-md border border-gray-100">
                    {/* Product Image */}
                    <div className="w-full sm:w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 relative">
                      <img 
                        src={item.product?.images?.[0] || '/placeholder.svg'} 
                        alt={item.product?.name || 'Product'} 
                        className="w-full h-full object-cover"
                      />
                      {(item.status === "Cancelled" || item.status === "Returned") && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <span className="text-xs font-bold text-white uppercase">
                            {item.status}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">
                          {item.product?.name || 'Product Name'}
                        </h4>
                        {(item.status === "Cancelled" || item.status === "Returned") && (
                          <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-xs">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                        <span>Size: {item.size}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ₹{item.productPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="flex-shrink-0 self-center mt-3 sm:mt-0">
                      <Link 
                        to={`/orders/${order.orderId}/item/${item._id}`}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex items-center gap-1"
                        onClick={(event) => event.stopPropagation()}
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
           {/* Full Order Cancel Button - Placed below the order content */}
           {(order.status === "Pending" || order.status === "Processing") &&
              !order.items.some(
                (item) => item.status === "Cancelled" || item.status === "Returned"
              ) && (
                <div className="p-4 border-t">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmCancel(e, order.orderId);
                    }}
                    className="w-44 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300"
                  >
                    Cancel Full Order
                  </Button>
                </div>
            )}  
         </div>     
        ))}
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
