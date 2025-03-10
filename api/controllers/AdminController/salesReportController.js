import orderDB from "../../Models/orderSchema.js";
import {errorHandler} from "../../Middleware/error.js"
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import PDFDocument from "pdfkit";
import PDFTableDocument from "pdfkit-table"; 
import  ExcelJS  from 'exceljs'

const dateRangeCalculator = (dateRange, from, to) => {
  const today = new Date();
  let startDate, endDate;

  switch (dateRange) {
    case "today":
      startDate = startOfDay(today);
      endDate = endOfDay(today);
      break;
    case "week":
      startDate = startOfWeek(today);
      endDate = endOfDay(today);
      break;
    case "month":
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      break;
    case "year":
      startDate = startOfYear(today);
      endDate = endOfYear(today);
      break;
    case "custom":
      const fromDate = new Date(from);
      const toDate = new Date(to);
      
      if (isNaN(fromDate) || isNaN(toDate)) {
        startDate = null;
        endDate = null;
      } else if (fromDate.getTime() === toDate.getTime()) {
      
        startDate = startOfDay(fromDate);
        endDate = endOfDay(fromDate);
      } else {
        startDate = startOfDay(fromDate);
        endDate = endOfDay(toDate);
      }
      break;
    default:
      startDate = null;
      endDate = null;
  }
  
  return { startDate, endDate };
};



const getSalesReport = async (req, res) => {
  try {
    const { filter, startDate: from, endDate: to, page = 1, limit = 10 } = req.query;
     
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const { startDate, endDate } = dateRangeCalculator(filter, from, to);

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    // First get the total count for pagination
    const totalOrdersCount = await orderDB.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const report = await orderDB.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          reportData: [
            {
              $project: {
                orderId: 1,
                orderedDate: "$createdAt",
                userName: "$user.firstName",
                paymentMethod: 1,
                items: 1,
                totalQuantity: { $sum: "$items.quantity" },
                totalAmount: 1,
                discountAmount: 1,
                couponCode: 1,
                paymentStatus: 1,
              },
            },
          ],
          summary: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSales: { $sum: "$totalAmount" },
                totalDiscount: { $sum: "$discountAmount" },
              },
            },
          ],
          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",
                total: { $sum: "$totalAmount" },
              },
            },
          ],
        },
      },
      // Apply pagination after facet
      {
        $project: {
          reportData: { $slice: ["$reportData", skip, parsedLimit] },
          summary: 1,
          paymentMethods: 1
        }
      }
    ]);

    const result = {
      data: report[0].reportData,
      summary: report[0].summary[0] || {
        totalOrders: 0,
        totalSales: 0,
        totalDiscount: 0,
      },
      paymentMethods: report[0].paymentMethods.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.total,
      }), {}),
    };

    res.status(200).json({
      success: true,
      message: "Sales report generated successfully",
      report: result,
      totalPages: Math.ceil(totalOrdersCount / parsedLimit),
      currentPage: parsedPage,
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default getSalesReport


export const downloadSalesReportPDF = async (req, res, next) => {
  try {
    const { filter, startDate: from, endDate: to } = req.query;
    const { startDate, endDate } = dateRangeCalculator(filter, from, to);

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    // Fetch sales report data
    const ordersReport = await orderDB.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          orderId: 1,
          orderedDate: "$createdAt",
          userName: "$user.firstName",
          paymentMethod: 1,
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: 1,
          discountAmount: 1,
          couponCode: 1,
          paymentStatus: 1,
        },
      },
    ]);

    // Compute summary data
    const summary = ordersReport.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc.totalSales += order.totalAmount;
        acc.totalDiscount += order.discountAmount;
        return acc;
      },
      { totalOrders: 0, totalSales: 0, totalDiscount: 0 }
    );

    // Create PDF Document
    const doc = new PDFTableDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Sales Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`, { align: "center" });
    doc.moveDown();

    // Summary Section
    doc.fontSize(14).text("Summary", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Total Orders: ${summary.totalOrders}`);
    doc.text(`Total Sales: ₹${summary.totalSales.toFixed(2)}`);
    doc.text(`Total Discount: ₹${summary.totalDiscount.toFixed(2)}`);
    doc.moveDown();

    // **Generate Table for Orders**
    const table = {
      title : "Orders Report",
      headers: [
        "Order ID",
        "Date",
        "Customer",
        "Payment Method",
        "Total Qty",
        "Total Amount",
        "Discount",
        "Coupon",
        "Status",
      ],
      rows: ordersReport.map((order) => [
        order.orderId,
        format(new Date(order.orderedDate), "MMM dd, yyyy"),
        order.userName || "N/A",
        order.paymentMethod,
        order.totalQuantity,
        `₹${order.totalAmount.toFixed(2)}`,
        `₹${order.discountAmount.toFixed(2)}`,
        order.couponCode || "-",
        order.paymentStatus,
      ]),
    };


    await doc.table(table)

   doc.end(); 

  } catch (error) {
    console.error("Error generating PDF report:", error);
    next(errorHandler(500, "Error generating PDF report"));
  }
};


export const downloadSalesReportExcel = async (req, res, next) => {
  try {
    const { filter, startDate: from, endDate: to } = req.query;
    const { startDate, endDate } = dateRangeCalculator(filter, from, to);

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    // Fetch sales report data
    const ordersReport = await orderDB.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          orderId: 1,
          orderedDate: "$createdAt",
          userName: "$user.firstName",
          paymentMethod: 1,
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: 1,
          discountAmount: 1,
          couponCode: 1,
          paymentStatus: 1,
        },
      },
    ]);

    // Compute summary data
    const summary = ordersReport.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc.totalSales += order.totalAmount;
        acc.totalDiscount += order.discountAmount;
        return acc;
      },
      { totalOrders: 0, totalSales: 0, totalDiscount: 0 }
    );

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // Add Title
    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Sales Report";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center" };

    // Add Date Range
    worksheet.mergeCells("A2:I2");
    const dateRangeCell = worksheet.getCell("A2");
    dateRangeCell.value = `Date Range: ${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
    dateRangeCell.font = { italic: true, size: 12 };
    dateRangeCell.alignment = { horizontal: "center" };

    // Add Summary Data
    worksheet.addRow([]);
    worksheet.addRow(["Total Orders", "Total Sales (₹)", "Total Discount (₹)"]);
    worksheet.addRow([summary.totalOrders, summary.totalSales.toFixed(2), summary.totalDiscount.toFixed(2)]);
    worksheet.addRow([]);

    // Define Column Headers
    worksheet.addRow([
      "Order ID",
      "Date",
      "Customer",
      "Payment Method",
      "Total Quantity",
      "Total Amount (₹)",
      "Discount (₹)",
      "Coupon",
      "Status",
    ]).font = { bold: true };

    // Add Sales Report Data
    ordersReport.forEach((order) => {
      const row = worksheet.addRow([
        order.orderId,
        format(new Date(order.orderedDate), "MMM dd, yyyy"),
        order.userName || "N/A",
        order.paymentMethod,
        order.totalQuantity, 
        order.totalAmount.toFixed(2),
        order.discountAmount.toFixed(2),
        order.couponCode || "-",
        order.paymentStatus,
      ]);
      row.getCell(5).alignment = { horizontal: "left" };
    });
    

    // Auto-fit Columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 10);
      });
      column.width = maxLength + 2;
    });

    // Set Response Headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.xlsx");

    // Write Excel file to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel report:", error);
    next(errorHandler(500, "Error generating Excel report"));
  }
};