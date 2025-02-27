import { cancelOrder, getUserOrders } from '@/Api/User/orderApi';
import { Button } from '@/components/ui/button';
import { message,Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserOrders = () => {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
     const d = new Date(dateStr);
     const day = String(d.getDate()).padStart(2, "0");
     const month = String(d.getMonth()+1).padStart(2, "0");
     const year = d.getFullYear();
     return `${day}/${month}/${year}`;
  }


  useEffect(() => {
    const fetchUserOrders = async() => {
      try{
        const response = await getUserOrders();
        setOrders(response.orders);
        console.log(response)
      }
      catch(error){
        console.log("Error in fetching orders");
        message.error(error?.message);
      }
    }
    fetchUserOrders()
  },[]);

  //to handle cancel orders
  const handleCancel = async(orderId) =>{
      try{
        const response = await cancelOrder(orderId);
        message.success(response.message)
      }
      catch(error){
        console.log(error);
        message.error(error?.message);
      }
  }

      // Confirmation dialog for deletion
      const confirmDelete = (id) => {
        Modal.confirm({
          title: "Are you sure you want to cancel this Order?",
          content: "This action cannot be undone.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            handleCancel(id);
          },
        });
      };


      if (orders.length === 0) {
        return (
          <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
            <p className="text-xl text-gray-600 mb-4">You haven't ordered anything yet.</p>
            <Button onClick={() => navigate('/shop-all')} className="px-6 py-3">
              Start Shopping
            </Button>
          </div>
        );
      }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
         <Link key={order._id} to={`/orders/${order.orderId}`}>
          <div className="border rounded-lg shadow-sm p-6 mt-10 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold">{order.orderId}</h2>
                <p className="text-gray-600">Ordered Date : {formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Cancelled' ? 'bg-red-400 text-gray-950':
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {order.items.map(item => (
                <div key={item._id} className="relative">
                  <img 
                    src={item.product.images?.[0]} 
                    alt={`Order item ${item.product.name}`} 
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                    {item.size}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {order.status === 'Cancelled' ? (
                <span>Order Cancelled</span>
              ) : (
                <span>Delivery Expected By : {formatDate(order.deliveryDate)}</span>
              )}
            </div>
            <div className="flex gap-2">
              {(order.status === 'Pending' || order.status === 'Processing') && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    confirmDelete(order.orderId);
                  }} 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
   
  );
};

export default UserOrders;