import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage({ orderDetails, discountAmount }) {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Order Successfully Placed!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank you for your purchase!</h1>
            <p className="text-gray-600">Your order has been successfully placed.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Order Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Delivery Expected By</h2>
                <p className="font-medium">
                  {new Date(orderDetails.deliveryDate).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="space-y-2">
                  <p className="font-medium">{orderDetails.deliveryAddress.fullname}</p>
                  <p className="text-gray-600">{orderDetails.deliveryAddress.buildingname}, {orderDetails.deliveryAddress.address}</p>
                  <p className="text-gray-600">{orderDetails.deliveryAddress.district}</p>
                  <p className="text-gray-600">Pincode: {orderDetails.deliveryAddress.pincode}</p>
                  <p className="text-gray-600">{orderDetails.deliveryAddress.state}</p>
                </div>
              </div>
            </div>

            {/* Payment Details and Summary */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium uppercase">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${orderDetails.paymentStatus.toLowerCase() === "paid" ? "text-green-600" : "text-red-600"}`}>
                      {orderDetails.paymentStatus}
                    </span>
                    <span className="text-gray-600">{orderDetails.transactionId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">₹{discountAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">₹{orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
            <Button onClick={() => navigate("/orders")} className="flex-1" variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Orders
            </Button>
            <Button onClick={() => navigate("/shop-all")} className="flex-1">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
