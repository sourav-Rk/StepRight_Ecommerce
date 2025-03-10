
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  CreditCard,
  Wallet,
  Package,
  Percent,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/Api/axios";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { downloadSalesReportExcel, downloadSalesReportPdf } from "@/Api/Admin/salesReportApi.js"

// helper functions to compute date range
const calculateDateRange = (filter) => {
  const today = new Date();
  switch (filter) {
    case "today":
      return { from: startOfDay(today), to: endOfDay(today) };
    case "week":
      return { from: startOfWeek(today), to: endOfWeek(today) };
    case "month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "year":
      return { from: startOfYear(today), to: endOfYear(today) };
    default:
      return { from: null, to: null };
  }
};

export default function SalesReport() {
  const [filter, setFilter] = useState("today");

  const [date, setDate] = useState(calculateDateRange("today"));

  const [customDate, setCustomDate] = useState({ from: null, to: null });

  // Pagination and report state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalDiscount: 0,
  });
  const [paymentMethods, setPaymentMethods] = useState({});
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    if (filter !== "custom") {
      const computed = calculateDateRange(filter);
      setDate(computed);
    }
  }, [filter]);

  // fetch sales report data when date, pagination, or filter change
  useEffect(() => {
    if (!date.from || !date.to) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: date.from.toISOString(),
          endDate: date.to.toISOString(),
          page: currentPage,
          limit: itemsPerPage,
          filter,
        });
        const response = await axiosInstance.get(`/admin/sales-report?${params}`);
        const data = response.data;
        console.log("Sales Report Data:", data);
        setOrders(data.report.data);
        setSummaryData(data.report.summary);
        setPaymentMethods(data.report.paymentMethods);
        setTotalOrdersCount(data.report.summary.totalOrders);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [date, currentPage, itemsPerPage, filter]);

  const totalPages = Math.ceil(totalOrdersCount / itemsPerPage);

  // Client-side filtering based on search term 
  const displayedOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };
  const goToFirstPage = () => goToPage(1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToLastPage = () => goToPage(totalPages);

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Function to handle PDF download
  const handleDownloadPdf = async () => {
    try {
      const params = new URLSearchParams({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        filter,
      });
      // Call the API function from the separate file
      const blob = await downloadSalesReportPdf(params.toString());
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales_report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  //handle download excel
  const handleDownloadExcel = async() => {
    try{
      const params = new URLSearchParams({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        filter,
      });
      const blob = await downloadSalesReportExcel(params.toString());
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sales_report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
    catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }

  return (
    <div className="p-4 md:p-6 md:ml-64 lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground">Monitor your sales performance and trends</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* Date Filter Dropdown */}
          <Select value={filter} onValueChange={(val) => setFilter(val)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Date Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {/* Custom Date Picker (only shown when filter is "custom") */}
          {filter === "custom" && (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[240px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate.from ? (
                      customDate.to ? (
                        <>
                          {format(customDate.from, "LLL dd, yyyy")} - {format(customDate.to, "LLL dd, yyyy")}
                        </>
                      ) : (
                        format(customDate.from, "LLL dd, yyyy")
                      )
                    ) : (
                      <span>Select Custom Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <Calendar
                    mode="range"
                    selected={customDate}
                    onSelect={setCustomDate}
                    numberOfMonths={2}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" onClick={() => setCustomDate({ from: null, to: null })}>
                      Reset
                    </Button>
                     <Button
                    onClick={() => {
                      if (customDate.from && customDate.to) {
                        // Update the main date state
                        setDate({ from: customDate.from, to: customDate.to });
                        // Update URL search params so the backend receives the custom dates
                        const params = new URLSearchParams(searchParams);
                        params.set("startDate", customDate.from.toISOString());
                        params.set("endDate", customDate.to.toISOString());
                        params.set("filter", "custom");
                    
                      }
                    }}
                  >
                    Apply
                  </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Export Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleDownloadExcel} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button onClick={handleDownloadPdf} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{summaryData.totalSales.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{summaryData.totalDiscount.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recently Ordered Items</CardTitle>
              <CardDescription>The 10 most recent orders placed on your store</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="space-y-4 overflow-x-auto">
                <div className="min-w-[600px]">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between p-4 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{order.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.orderId} • {format(new Date(order.orderedDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                        <UIBadge variant={order.paymentStatus === "paid" ? "success" : "outline"}>
                          {order.paymentStatus}
                        </UIBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {displayedOrders.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, displayedOrders.length)} of {displayedOrders.length} entries
              </div>
              <div className="flex items-center gap-1">
                <div className="hidden md:flex items-center mr-2 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
          <TabsContent value="detailed" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Detailed Sales Report</CardTitle>
              <CardDescription>Comprehensive view of all orders and transactions</CardDescription>
            </CardHeader>
         <CardContent>
         <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Coupon</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedOrders.length > 0 ? (
                        displayedOrders.map((order) => (
                          <TableRow key={order.orderId}>
                            <TableCell className="font-medium">{order.orderId}</TableCell>
                            <TableCell>{format(new Date(order.orderedDate), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{order.userName.toLowerCase()}</TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell>{order.totalQuantity || order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                            <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>₹{order.discountAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              {order.couponCode ? (
                                <UIBadge variant="outline">{order.couponCode}</UIBadge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <UIBadge variant={order.paymentStatus === "paid" ? "success" : "outline"}>
                                {order.paymentStatus}
                              </UIBadge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-1">
                <div className="hidden md:flex items-center mr-2 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">COD</CardTitle>
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-blue-100">Cash On Delivery</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">₹{(paymentMethods["cod"] || 0).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  {((paymentMethods["cod"] || 0) / summaryData.totalSales * 100).toFixed(1)}% of total sales
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Online</CardTitle>
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-blue-100">Online payments</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">₹{(paymentMethods["online"] || 0).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  {((paymentMethods["online"] || 0) / summaryData.totalSales * 100).toFixed(1)}% of total sales
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Wallet</CardTitle>
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <CardDescription className="text-green-100">Wallet payments</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">₹{(paymentMethods["wallet"] || 0).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  {((paymentMethods["wallet"] || 0) / summaryData.totalSales * 100).toFixed(1)}% of total sales
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
