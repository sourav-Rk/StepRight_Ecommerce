import { useEffect, useState } from "react"
import { ChevronDown, Package, User, MapPin, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { Link, useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"              
import { Separator } from "@/components/ui/separator"
import { getAllOrders, updateOrderStatus } from "@/Api/Admin/ordersApi"
import { message } from "antd"

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Define your allowed transitions mapping
const allowedTransitions = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: []
};


const isOptionDisabled = (currentStatus, optionValue) => {
  if (currentStatus === optionValue) return false;
  return !allowedTransitions[currentStatus]?.includes(optionValue);
};

export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
     const fetchOrders = async () =>{
        try{
            const response = await getAllOrders();
            setOrders(response.orders)
        }
        catch(error){
            console.log(error);
            message.error(error?.response);
        }
     }
     fetchOrders();
  },[]);

  // to handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
     try{
      const response = await updateOrderStatus(orderId, newStatus);
      message.success(response.message);
     }
     catch(error){
       message.error(error?.message || "Failed to chamnge");
       console.log(error)
     }
   
  }

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 mt-8">
      <div className="p-4 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                <div className="flex gap-4"></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>                
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow 
                          key={order._id}
                          className="hover:bg-muted/50  cursor-pointer"
                          onClick={()=>navigate(`/admin/orders/${order.orderId}`)}
                      >
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.userId.firstName}</span>
                            <span className="text-sm text-muted-foreground">{order.userId.email}</span>
                            <span className="text-sm text-muted-foreground">{order.userId.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
                        
                        <TableCell className="uppercase font-medium">{order.paymentMethod}</TableCell>
                        <TableCell className="font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
                     
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                {orders.map((order) => (
                  <Collapsible key={order._id}>
                    <Card className="border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-4 pt-0">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{order.userId.firstName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{order.userId.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">{order.userId.phone}</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Delivery Address
                            </h4>
                            <div className="text-sm space-y-1 text-muted-foreground">
                              <p>{order.deliveryAddress.fullname}</p>
                              <p>{order.deliveryAddress.buildingname}</p>
                              <p>{order.deliveryAddress.address}</p>
                              <p>
                                {order.deliveryAddress.city}, {order.deliveryAddress.state}
                              </p>
                              <p>{order.deliveryAddress.pincode}</p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Payment Method</span>
                              <span className="font-medium uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Total Amount</span>
                              <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Order Items
                            </h4>
                            {order.items.map((item) => (
                              <div key={item._id} className="flex justify-between items-center">
                                <div className="text-sm">
                                  <p>Size: {item.size}</p>
                                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₹{(item.productPrice * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4">
                            <Select
                              defaultValue={order.status}
                              onValueChange={(value) => handleStatusChange(order.orderId, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Pending">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

