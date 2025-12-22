import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { XCircle, CheckCircle } from "lucide-react";
import Sidebar from "../Sidebar";
import { editUser, getUsers } from "@/Api/Admin/customerApi";
import ConfirmSwitch from "../Modal/ConfirmSwitch";
import { message } from "antd";
import "antd/dist/reset.css";
import { useDebounce } from "@/hooks/useDebounce";

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const customersPerPage = 5;

  //fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await getUsers(
          currentPage,
          customersPerPage,
          debouncedSearchTerm
        );
        setCustomers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  // Toggle Block/Unblock Status
  const toggleBlockStatus = async (id) => {
    try {
      await editUser(id); // api call to block or unblock the user

      setCustomers(
        customers.map((customer) =>
          customer._id === id
            ? { ...customer, isBlocked: !customer.isBlocked }
            : customer
        )
      );
    } catch (error) {
      message.error(error.message || "Error updating user status");
      console.error("Error updating user status", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-[calc(100%-16rem)] min-h-screen bg-gray-100 p-8 ml-64 transition-all">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-4xl font-bold mb-8 text-center">Customers</h2>

          <div className="flex justify-end mb-6">
            <input
              type="text"
              placeholder="Search by first name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on new search
              }}
              className="w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <Table className="w-full text-lg">
            <TableHeader>
              <TableRow className="bg-gray-200 text-gray-700 h-16">
                <TableHead className="w-20 text-center">SL No</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Mobile Number</TableHead>
                <TableHead className=" pl-4">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow
                  key={customer._id}
                  className="hover:bg-gray-100 transition h-20"
                >
                  <TableCell className="text-center">
                    {(currentPage - 1) * customersPerPage + index + 1}
                  </TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>

                  <TableCell className="text-center">
                    {customer.isBlocked ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <ConfirmSwitch
                      checked={!customer.isBlocked}
                      name={customer.name}
                      onToggle={() => toggleBlockStatus(customer._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-6 w-6" />
              Prev
            </Button>
            <span className="text-gray-600 font-semibold text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
