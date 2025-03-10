import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package2 } from "lucide-react";
import { motion } from "framer-motion";
import { getCartProducts, removeCartItem, updateCartItemQuantity } from "@/Api/User/cartApi";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await getCartProducts();
        console.log(response);
        setCartItems(response.cartProducts.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCartProducts();
  }, []);

  //update quantity by api call
  const updateQuantity = async (itemId, change) => {
    try {
      const response = await updateCartItemQuantity(itemId, change);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity + change } : item
        )
      );
    } catch (error) {
      console.log(error?.message);
      message.error(error?.message || "Failed to update the quantity");
    }
  };

  //remove item 
  const removeItem = async (itemId) => {
    try {
      const response = await removeCartItem(itemId);
      message.success(response.message);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to remove item");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product.isActive) return total;
      const price =
        item.price ||
        (item.product?.variants?.find((v) => v.size === item.size)?.regularPrice || 0);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gray-50 rounded-2xl"
          >
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping to fill your cart with amazing products!
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/shop-all")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
                    <div className="p-6">
                      <div className={`flex gap-6 ${!item.product.isActive ? "opacity-50" : ""}`}>
                        {/* Product Image */}
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{item.product.name}</h3>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                              </div>
                              {!item.product.isActive && (
                                <p className="text-xl text-center text-red-500 mt-1">Unavailable</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item._id, -1)}
                                disabled={!item.product.isActive}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item._id, 1)}
                                disabled={!item.product.isActive}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeItem(item._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="h-px bg-gray-200 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Total</span>
                      <span className="text-2xl font-bold">₹{(calculateSubtotal()).toFixed(2)}</span>
                    </div>
                    <Button 
                      onClick={() => navigate("/checkout")}
                      className="w-full mt-6 bg-black hover:bg-gray-800 text-white h-12 text-lg"
                      disabled={cartItems.some(item => !item.product.isActive)}
                    >
                      Proceed to Checkout
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Free shipping on all orders. 30-day return policy.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
