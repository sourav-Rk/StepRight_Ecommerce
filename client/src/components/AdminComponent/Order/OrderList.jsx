import { useEffect, useState } from "react";
import {
  ChevronDown,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { format } from "date-fns";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getAllOrders, updateOrderStatus } from "@/Api/Admin/ordersApi";
import { message } from "antd";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Define your allowed transitions mapping
const allowedTransitions = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const isOptionDisabled = (currentStatus, optionValue) => {
  if (currentStatus === optionValue) return false;
  return !allowedTransitions[currentStatus]?.includes(optionValue);
};

export default function OrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Get current page and searcg term from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";
  const ordersPerPage = 10;
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: currentPage,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getAllOrders({
          params: {
            page: currentPage,
            limit: ordersPerPage,
            search: searchQuery,
          },
        });
        console.log("orders:",orders)

        setOrders(response.orders);
        setPagination(response.pagination);
      } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, searchQuery]);

  // useEffect for search input debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchInput) params.set("search", searchInput);
      if (currentPage > 1) params.set("page", currentPage);

      if (searchInput !== searchQuery) {
        params.set("page", "1");
      }

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, currentPage]);

  //handle search input
  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({ page: "1" });
  };

  // paginate function
  const paginate = (pageNumber) => {
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    params.set("page", pageNumber.toString());
    setSearchParams(params);
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 mt-8">
      <div className="p-4 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-white sticky top-0 z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                <form
                  onSubmit={handleSearch}
                  className="flex gap-2 w-full md:w-auto"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Loading orders...</p>
                </div>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">
                            Order ID
                          </TableHead>
                          <TableHead className="font-semibold">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">
                            Payment
                          </TableHead>
                          <TableHead className="font-semibold">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <TableRow
                              key={order._id}
                              className="hover:bg-muted/50 cursor-pointer"
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                            >
                              <TableCell className="font-medium">
                                {order.orderId}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {order?.userId?.firstName}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {order?.userId?.email}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {order?.userId?.phone}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {format(
                                  new Date(order.createdAt),
                                  "MMM dd, yyyy"
                                )}
                              </TableCell>
                              <TableCell className="uppercase font-medium">
                                {order.paymentMethod}
                              </TableCell>
                              <TableCell className="font-medium">
                                ₹{order.totalAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-4 p-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <Collapsible key={order._id}>
                          <Card className="border shadow-sm">
                            <CollapsibleTrigger asChild>
                              <CardHeader className="cursor-pointer hover:bg-muted/50">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <p className="font-medium">
                                      {order?.orderId}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {format(
                                        new Date(order.createdAt),
                                        "MMM dd, yyyy"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="space-y-4 pt-0">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                      {order?.userId?.firstName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">
                                      {order?.userId?.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">
                                      {order?.userId?.phone}
                                    </span>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Delivery Address
                                  </h4>
                                  <div className="text-sm space-y-1 text-muted-foreground">
                                    <p>{order.deliveryAddress.fullname}</p>
                                    <p>{order.deliveryAddress.buildingname}</p>
                                    <p>{order.deliveryAddress.address}</p>
                                    <p>
                                      {order.deliveryAddress.city},{" "}
                                      {order.deliveryAddress.state}
                                    </p>
                                    <p>{order.deliveryAddress.pincode}</p>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Payment Method
                                    </span>
                                    <span className="font-medium uppercase">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Total Amount
                                    </span>
                                    <span className="font-medium">
                                      ₹{order.totalAmount.toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Order Items
                                  </h4>
                                  {order.items.map((item) => (
                                    <div
                                      key={item._id}
                                      className="flex justify-between items-center"
                                    >
                                      <div className="text-sm">
                                        <p>Size: {item.size}</p>
                                        <p className="text-muted-foreground">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                      <p className="font-medium">
                                        ₹
                                        {(
                                          item.productPrice * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      ))
                    ) : (
                      <div className="text-center py-8">No orders found</div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="border-t p-4 bg-white">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-muted-foreground">
                  {pagination.total > 0 ? (
                    <>
                      Showing {(pagination.currentPage - 1) * ordersPerPage + 1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.currentPage * ordersPerPage,
                        pagination.total
                      )}{" "}
                      of {pagination.total} orders
                    </>
                  ) : (
                    "No orders found"
                  )}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        // Logic to show pagination numbers around current page
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pagination.currentPage === pageNum
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => paginate(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
