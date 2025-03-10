import { CalendarDays, CreditCard, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { cancelSingleItem, getOrderById } from "@/Api/User/orderApi";
import { message,Modal } from "antd";

export default function OrderDetails() {
  const {orderId} = useParams();
  const [order, setOrder] = useState(null);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchOrder = async() => {
        try{
            const response = await getOrderById(orderId);
            console.log(response)
            setOrder(response.order)
        }
        catch(error){
            console.log(error);
            message.error(error?.message);
        }
    }
    fetchOrder()
  },[orderId]);

  // Confirmation dialog for deletion
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this Item?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        handleCancelItem(id);
      },
    });
  };
 
  if (!order) return <p>Loading order details...</p>;

  
  const getStatusColor = (status) => {
    const statusColors = {
      Delivered: "bg-green-500",
      Paid: "bg-green-500",
      Pending: "bg-blue-300",
      Processing:"bg-blue-500",
      Cancelled:"bg-red-500"
    }
    return statusColors[status] || "bg-gray-500"
  }

  // Calculate discount from the order totals
  const discount = (order.subtotal + order.tax) - order.totalAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        <div className="grid gap-6">
          {/* Top Section Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Order Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">{order.orderId}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
            <CardContent className="p-6">
                <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-medium">{order.deliveryAddress.fullname}</p>
                    <p className="text-sm text-muted-foreground">Email: {order.deliveryAddress.email}</p>
                    <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.buildingname}, {order.deliveryAddress.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    District: {order.deliveryAddress.district}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    Landmark: {order.deliveryAddress.landmark}
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl border bg-white">
              <CardContent className="p-6 flex flex-col gap-4">
                {/* Payment Method Section */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                    <CreditCard className="h-7 w-7 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                {/* Payment Status Section */}
                <div className="flex justify-between items-center border-t pt-4">
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="text-sm font-bold">{order.paymentStatus}</p>
                </div>
            
                {order.transactionId && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-sm font-medium text-gray-900">{order.transactionId}</p>
                  </div>
                )}                    
               </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Order Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span> ₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-red-600">-₹{discount.toFixed(2)}</span>
                    </div>
                    
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
        {/* Order Items */}
        <Card className="shadow-lg border rounded-md overflow-hidden">
          <CardHeader className="bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Order Items
              </CardTitle>
              {/* Additional header elements can go here */}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="divide-y">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-4 py-4"
                >
                  {/* Left Section: Product Image & Details */}
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Size:</span> {item.size}
                        </p>
                        <p>
                          <span className="font-semibold">Qty:</span> {item.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">Price:</span> ₹
                          {item.productPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {/* Status */}
                    <div className="flex flex-col items-end">
                      <span className={`text-sm bg-gray-200 px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Total Price */}
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{(item.productPrice * item.quantity).toFixed(2)}
                    </p>
                 
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

