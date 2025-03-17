import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccessPage({ orderDetails, discountAmount }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-green-500 text-white py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
            >
              <Check className="w-10 h-10 text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl font-semibold">Order Successfully Placed!</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your purchase!</h1>
              <p className="text-gray-600">Your order has been successfully placed.</p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Order Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Order Details</h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <h2 className="text-lg font-semibold border-b pb-2">Delivery Expected By</h2>
                <p className="font-medium text-gray-700">{new Date(orderDetails.deliveryDate).toLocaleDateString("en-GB")}</p>
                <h2 className="text-lg font-semibold border-b pb-2">Delivery Address</h2>
                <p className="font-medium text-gray-800">{orderDetails.deliveryAddress.fullname}</p>
                <p className="text-gray-600">{orderDetails.deliveryAddress.buildingname}, {orderDetails.deliveryAddress.address}</p>
                <p className="text-gray-600">{orderDetails.deliveryAddress.district}, {orderDetails.deliveryAddress.state}</p>
                <p className="text-gray-600">Pincode: {orderDetails.deliveryAddress.pincode}</p>
              </div>

              {/* Payment Details & Summary */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Payment Details</h2>
                <p className="text-gray-700"><strong>Method:</strong> {orderDetails.paymentMethod.toUpperCase()}</p>
                <p className={`font-medium ${orderDetails.paymentStatus.toLowerCase() === "paid" ? "text-green-600" : "text-red-600"}`}>
                  <strong>Status:</strong> {orderDetails.paymentStatus}
                </p>
                <p className="text-gray-700"><strong>Transaction ID:</strong> {orderDetails.transactionId}</p>

                <h2 className="text-lg font-semibold border-b pb-2">Summary</h2>
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
                  <div className="flex justify-between text-sm font-semibold text-gray-900">
                    <span>Total:</span>
                    <span>₹{orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/orders")}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <ShoppingBag className="mr-2 h-5 w-5 inline" /> View Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/shop-all")}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Continue Shopping <ArrowRight className="ml-2 h-5 w-5 inline" />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
