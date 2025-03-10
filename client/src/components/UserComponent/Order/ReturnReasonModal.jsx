import React, { useState } from 'react';
import { Modal, Radio, Input, Space, message } from 'antd';
import { AlertCircle, ArrowRight, Send } from "lucide-react";
import { Button } from '@/components/ui/button';


const ReturnReasonModal = ({ isOpen, onClose, onSubmit, orderId, itemId }) => {
  const [returnReason, setReturnReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);

  const returnReasons = [
    "Size too small",
    "Size too large",
    "Different from pictures shown",
    "Quality not as expected",
    "Uncomfortable to wear",
    "Wrong item received",
    "Damaged during shipping",
    "Color difference",
    "Material not as described",
    "Other (please specify)"
  ];

  const handleReasonChange = (e) => {
    setReturnReason(e.target.value);
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const handleSubmit = async () => {
    if (!returnReason) {
      message.error("Please select a reason for return");
      return;
    }

    if (returnReason === "Other (please specify)" && !otherReason.trim()) {
      message.error("Please specify your return reason");
      return;
    }

    setLoading(true);
    try {
      // Pass the selected reason (or custom reason if "Other" was selected)
      const finalReason = returnReason === "Other (please specify)" ? otherReason : returnReason;
      await onSubmit(orderId, itemId, finalReason);
      resetForm();
    } catch (error) {
      console.error("Return submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setReturnReason('');
    setOtherReason('');
  };

  return (
    <Modal
      open={isOpen}
      title={null}
      footer={null}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      width={500}
      className="return-reason-modal"
      centered
    >
      <div className="p-2">
        {/* Header */}
        <div className="flex items-start mb-6">
          <div className="bg-amber-100 p-2 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Return Request</h3>
            <p className="text-gray-600 text-sm">
              Please tell us why you want to return this item. This helps us improve our products.
            </p>
          </div>
        </div>

        {/* Return Reason Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Reason for Return:</h4>
          <Radio.Group onChange={handleReasonChange} value={returnReason} className="w-full">
            <Space direction="vertical" className="w-full">
              {returnReasons.map((reason) => (
                <Radio 
                  key={reason} 
                  value={reason}
                  className="py-2 px-4 border border-gray-200 rounded-lg w-full flex items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="ml-2">{reason}</span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Other Reason Text Input */}
        {returnReason === "Other (please specify)" && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Please specify your reason:</h4>
            <Input.TextArea
              placeholder="Please provide details about why you're returning this item..."
              value={otherReason}
              onChange={handleOtherReasonChange}
              autoSize={{ minRows: 3, maxRows: 5 }}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Return Policy Reminder */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Return Policy Reminder:</strong> Items must be returned in their original packaging within 7 days of delivery. 
            The refund will be processed to your wallet after we receive and inspect the item.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg transition-all flex items-center gap-2"
            disabled={!returnReason || (returnReason === "Other (please specify)" && !otherReason.trim())}
          >
            <span>Submit Return</span>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};


export default ReturnReasonModal;