import { useState, useEffect, useRef } from "react"
import { Printer, Download, ShoppingBag } from "lucide-react"
import { message } from "antd"
import {getOrderById} from "@/Api/User/orderApi.js"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function Invoice({ order }) {
  const [currentDate, setCurrentDate] = useState("")
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const invoiceRef = useRef(null)

  // Function to fetch the order details
  const fetchOrderById = async (order) => {
    try {
      setLoading(true)
      const response = await getOrderById(order);
      setOrderDetails(response.order)
      setLoading(false)
    } catch (error) {
      console.log("Error in fetching the order", error)
      message.error(error?.message || "Failed to fetch order details")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (order) {
      fetchOrderById(order)
    }
  }, [order])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount / 100)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }


  //function to handle PDF download
  const downloadPDF = () => {
    const input = invoiceRef.current;

  const buttons = input.querySelectorAll("button");
  buttons.forEach((button) => (button.style.display = "none"));

    html2canvas(input, {scale: 2}).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${orderDetails.orderId}.pdf`);

        buttons.forEach((button) => (button.style.display = "block"));
    })
  }

  if (loading) {
    return <div>Loading invoice details...</div>
  }

  if (!orderDetails) {
    return <div>No order details found</div>
  }

  return (
    <div
      ref={invoiceRef}
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "32px",
          backgroundColor: "#f8f8f8",
          borderBottom: "1px solid #eaeaea",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#000",
              color: "#fff",
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
          <img 
            src="/StepRightLogo.png" 
            alt="StepRight Logo" 
            style={{ width: "100%", height: "100%", objectFit: "contain" , borderRadius:"10px" }}
         />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>StepRight</h1>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}>INVOICE</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>{currentDate}</p>
        </div>
      </div>

       {/* Company Details */}
    <div
      style={{
        padding: "24px 32px",
        backgroundColor: "#f0f0f0",
        borderBottom: "1px solid #eaeaea",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#888",
            marginTop: 0,
            marginBottom: "8px",
          }}
        >
          From
        </h3>
        <p style={{ margin: "0 0 4px 0", fontWeight: 600, fontSize: "16px" }}>
          StepRight Footwear Pvt. Ltd.
        </p>
        <p style={{ margin: 0, color: "#555", fontSize: "14px", lineHeight: "1.5" }}>
          123 Fashion Street, Retail Hub<br />
          Bangalore, Karnataka - 560001<br />
          Email: contact@stepright.com<br />
          Phone: +91 80 1234 5678
        </p>
      </div>
      
      <div>
        <h3
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#888",
            marginTop: 0,
            marginBottom: "8px",
          }}
        >
          GST Details
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#555", fontSize: "14px", fontWeight: 600 }}>GSTIN:</span>
            <span style={{ fontWeight: 500, fontSize: "14px" }}>29AABCS1234A1Z5</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#555", fontSize: "14px", fontWeight: 600 }}>PAN:</span>
            <span style={{ fontSize: "14px" }}>AABCS1234A</span>
          </div>
        </div>
      </div>
    </div>


      {/* Invoice Details */}
      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Top Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                marginTop: 0,
                marginBottom: "12px",
              }}
            >
              Invoice To
            </h3>
            <p style={{ margin: "0 0 4px 0", fontWeight: 600, fontSize: "16px" }}>
              {orderDetails.deliveryAddress.fullname}
            </p>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              {orderDetails.deliveryAddress.buildingname}, {orderDetails.deliveryAddress.address}
              <br />
              {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.district}
              <br />
              {orderDetails.deliveryAddress.state} - {orderDetails.deliveryAddress.pincode}
              <br />
              Email: {orderDetails.deliveryAddress.email}
              <br />
              Phone: {orderDetails.userId.phone}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                marginTop: 0,
                marginBottom: "12px",
              }}
            >
              Invoice Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666", fontSize: "14px" }}>Order ID:</span>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{orderDetails.orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666", fontSize: "14px" }}>Order Date:</span>
                <span style={{ fontSize: "14px" }}>{formatDate(orderDetails.createdAt)}</span>
              </div>
            </div>
          </div>

          <div>
          
            <div style={{ marginTop: "12px", fontSize: "14px" }}>
              <p style={{ margin: "0 0 4px 0", color: "#666" }}>Transaction ID:</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{orderDetails.transactionId?orderDetails.transactionId : orderDetails.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#888",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            Order Summary
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f8f8" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    Size
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    Unit Price
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      borderBottom: "1px solid #eaeaea",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea" }}>{index + 1}</td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea", fontWeight: 500 }}>
                      {item.product.name}
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                        {item.product.category.name}
                      </div>
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea" }}>{item.size}</td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea", textAlign: "right" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea", textAlign: "right" }}>
                      ₹{(item.productPrice).toFixed(2)}
                    </td>
                    <td style={{ padding: "16px", borderBottom: "1px solid #eaeaea", textAlign: "right" }}>
                      ₹{(item.productPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", maxWidth: "300px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "#666" }}>Subtotal:</span>
              <span>₹{(orderDetails.subtotal ).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "#666" }}>Tax:</span>
              <span>₹{(orderDetails.tax).toFixed(2)}</span>
            </div>
            {orderDetails.discountAmount >= 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#666" }}>
                  Discount {orderDetails.couponCode ? `(Coupon: ${orderDetails.couponCode})` : ""}:
                </span>
                <span>-₹{(orderDetails.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div style={{ height: "1px", backgroundColor: "#eaeaea", margin: "12px 0" }}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              <span>Total:</span>
              <span>₹{(orderDetails.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "24px 32px",
          backgroundColor: "#f8f8f8",
          borderTop: "1px solid #eaeaea",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "14px" }}>Thank you for shopping with StepRight!</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <Printer size={16} />
            Print Invoice
          </button>
          <button
            onClick={downloadPDF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}