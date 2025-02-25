import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: function () {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const randomNum = Math.floor(Math.random() * 1000);
      return `STEPRIGHT-${year}${month}${day}-${randomNum}`;
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  deliveryAddress: {
    type: Object,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productPrice: { type: Number },
      size: { type: String },
      quantity: { type: Number },
      status: { type: String, default: "Pending" },
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
  deliveryDate: {
    type: Date,
    default: () => {
      const today = new Date();
      today.setDate(today.getDate() + 6);
      return today;
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const orderDB = mongoose.model("order", orderSchema);
export default orderDB;
