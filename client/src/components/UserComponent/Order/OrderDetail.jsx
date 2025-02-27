import { CalendarDays, CreditCard, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getOrderById } from "@/Api/User/orderApi";
import { message } from "antd";

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

  if (!order) return <p>Loading order details...</p>;

  
  const getStatusColor = (status) => {
    const statusColors = {
      Delivered: "bg-green-500",
      Paid: "bg-green-500",
      Pending: "bg-yellow-500",
      Failed: "bg-red-500",
    }
    return statusColors[status] || "bg-gray-500"
  }

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

            {/* Payment Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`} />
                      <span className="text-sm">{order.status}</span>
                    </div>
                  </div>
                </div>
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
                      <span className="text-muted-foreground">Total</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`} />
                  <span className="text-sm font-medium">{order.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                      <img src={item.product.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <p>Size: {item.size}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground"> ₹{item.productPrice.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 sm:text-right">
                        <p className="font-medium"> ₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                      </div>
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

