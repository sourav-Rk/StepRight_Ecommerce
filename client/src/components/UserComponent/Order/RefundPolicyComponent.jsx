import React, { useState } from 'react';
import { X, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const RefundPolicyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePolicy = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4">
      {/* Button to toggle policy visibility */}
      <button
        onClick={togglePolicy}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
      >
        <FileText size={16} />
        <span>View Refund Policy</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Policy content - visible only when isOpen is true */}
      {isOpen && (
        <div className="mt-3 relative bg-white border border-gray-200 rounded-lg shadow-md p-5 animate-fadeIn">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-bold text-gray-800 mb-3">Refund Policy</h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              We want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help.
            </p>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Eligibility for Refunds:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Items must be unused and in original condition with all tags attached</li>
                <li>Refund requests must be initiated within 7 days of delivery</li>
                <li>Shipping charges and convenience fees are non-refundable</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Refund Calculation</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>If a coupon or discount was applied, the refund is adjusted by the effective discount rate</li>
                <li>Refunds will be issued only for the cost of the product(s) purchased. Any discounts applied will be factored into the refund calculation.</li>
                <li>For partial returns, only the affected items are refunded based on their price and discount.</li>
                <li>Admin Approval: Refund requests are first marked as pending and require admin approval.</li>
                <li>Refund Crediting: Once approved, the refund is credited to your wallet within 3 business days.</li>
                <li>Exclusions: Customized or non-returnable items may not be eligible for refunds.</li>
              </ol>
            </div>

            <div>
            <h4 className="font-semibold text-gray-700 mb-1">Non-Refundable charges:</h4>
            <ol className="list-decimal pl-5 space-y-1">
                <li>Tax: The tax charged at the time of purchase is non-refundable.</li>
                <li>Shipping & Handling: Any shipping or handling fees are also non-refundable.</li>
                <li>For partial returns, only the product price (adjusted for any discount) for the returned items will be refunded. The tax and other non-refundable fees on the remaining items will not be adjusted.</li>
            </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Refund Options:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Original payment method refund</li>
                <li>Store credit (with 5% additional value)</li>
                <li>Exchange for another item</li>
              </ul>
            </div>
            
            <p className="italic">
              For questions regarding our refund policy, please contact our customer support team at support@stepright.com or call us at +91-9876543210.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPolicyComponent;