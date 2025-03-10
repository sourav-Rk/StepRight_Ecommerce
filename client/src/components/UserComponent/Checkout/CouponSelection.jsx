import { useEffect, useState } from "react";
import { Gift, Scissors, ShoppingBag } from "lucide-react";
import { getCoupons } from "@/Api/User/couponApi";
import { message } from "antd";

const CouponSelection = ({ subTotal, applyCoupon, usedCoupons = [] }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons();
        setCoupons(response.coupons || []);
      } catch (error) {
        message.error(error?.message);
      }
    };
    fetchCoupons();
  }, []);

  const handleCouponSelect = (coupon) => {
    if (!coupon.isActive) {
      message.warning("This coupon is no longer active.");
      return;
    }

    if (usedCoupons.includes(coupon._id)) {
      message.warning("You have already used this coupon.");
      return;
    }

    if (selectedCoupon?._id === coupon._id) {
      setSelectedCoupon(null);
      applyCoupon(null);
      return;
    }

    if (subTotal >= coupon.minimumPurchase) {
      setSelectedCoupon(coupon);
      applyCoupon(coupon);
    } else {
      message.warning(`Spend ₹${coupon.minimumPurchase - subTotal} more to use this coupon.`);
    }
  };

  const calculateDiscountAmount = (coupon) => {
    return coupon.discountType === "percentage"
      ? `${coupon.discountValue}%`
      : `₹${coupon.discountValue}`;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6 space-x-3">
        <div className="bg-neutral-900 text-white p-2.5 rounded-full">
          <Gift className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Available Coupons</h2>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300">
        {coupons.length > 0 ? (
          coupons.map((coupon) => {
            const isEligible = subTotal >= coupon.minimumPurchase;
            const isSelected = selectedCoupon?._id === coupon._id;
            const isUsed = usedCoupons.includes(coupon._id);

            return (
              <div
                key={coupon._id}
                className={`relative border rounded-xl transition-all duration-300 group
                ${isEligible && coupon.isActive && !isUsed ? "hover:shadow-md cursor-pointer border-neutral-300 hover:border-neutral-500" : "opacity-60 cursor-not-allowed border-neutral-200"}
                ${isSelected ? "border-2 border-neutral-900" : ""}`}
                onClick={() => handleCouponSelect(coupon)}
              >
                <div className="absolute inset-0 border-2 border-dashed border-neutral-200 rounded-xl pointer-events-none"></div>

                <div className="relative z-10 p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isEligible && coupon.isActive && !isUsed
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-sm text-neutral-900">{coupon.code}</p>
                          {isSelected && (
                            <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full">
                              Applied
                            </span>
                          )}
                          {isUsed && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Used
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600">{coupon.description}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className={`text-base font-bold block ${isEligible && coupon.isActive && !isUsed ? "text-neutral-900" : "text-neutral-400"}`}>
                        {calculateDiscountAmount(coupon)}
                      </span>
                      <span className="text-[10px] text-neutral-500">discount</span>
                    </div>
                  </div>

                  {!isEligible && !isUsed && (
                    <div className="mt-3 flex items-center space-x-2 bg-neutral-100 text-neutral-700 p-2 rounded-md text-xs">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Spend ₹{coupon.minimumPurchase - subTotal} more to unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No coupons available.</p>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-neutral-600">
        {selectedCoupon ? (
          <p>
            Coupon <span className="font-bold text-neutral-900">{selectedCoupon.code}</span> applied successfully!
          </p>
        ) : (
          <p>Select an eligible coupon to get an instant discount.</p>
        )}
      </div>
    </div>
  );
};

export default CouponSelection;
