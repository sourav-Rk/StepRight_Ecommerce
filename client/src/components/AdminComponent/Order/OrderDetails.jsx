import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, CreditCard, MapPin, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getOrderById } from "@/Api/User/orderApi"
import { message } from "antd";

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.order);
      } catch (error) {
        console.log(error);
        message.error(error?.message);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;


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
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-3 py-1 rounded ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Payment Details</h2>
                <p><strong>Method:</strong> {order.paymentMethod}</p>
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={item.product.images?.[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-20 h-20 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.productPrice.toFixed(2)} each</p>
                      <p>Total: ₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                    </div>
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
