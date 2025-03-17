import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const WalletComponent = ({   wallet, 
  currentPage, 
  setCurrentPage, 
  activeFilter, 
  setActiveFilter, 
  totalPages  }) => 
    {

  // const transactionsPerPage = 5;

  const currentWallet = wallet || { transactions: [], balance: 0 };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter transactions
  // const filterTransactions = (transactions) => {
  //   let filteredTransactions = transactions;

  //   switch (activeFilter) {
  //     case "Credit":
  //       filteredTransactions = transactions.filter(
  //         (t) => t.transactionType === "Credit"
  //       );
  //       break;
  //     case "Debit":
  //       filteredTransactions = transactions.filter(
  //         (t) => t.transactionType === "Debit"
  //       );
  //       break;
  //     default:
  //       filteredTransactions = transactions;
  //   }

  //   return filteredTransactions;
  // };

  // // Pagination
  // const filteredTransactions = filterTransactions(currentWallet.transactions);


  // const paginatedTransactions = filteredTransactions.slice(
  //   (currentPage - 1) * transactionsPerPage,
  //   currentPage * transactionsPerPage
  // );

  // // Pagination handlers
  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Stylish Wallet Header */}
      <div className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Wallet className="w-8 h-8 text-neutral-300" />
                <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
              </div>
              <p className="text-neutral-400 text-sm">
                Manage your funds and track transactions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-neutral-800 hover:bg-neutral-700 p-3 rounded-full transition-all">
                <RefreshCw className="w-5 h-5 text-neutral-300" />
              </button>
              {/* <button className="bg-white text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-neutral-200 transition-all">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add Funds</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Wallet Summary */}
        <div className="bg-neutral-100 rounded-2xl p-6 shadow-lg mb-8 -mt-12 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-neutral-500">Total Balance</p>
              <h2 className="text-3xl font-bold text-black">
                {formatCurrency(currentWallet.balance)}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">Available to Spend</p>
              <p className="text-xl font-semibold text-black">
                {formatCurrency(currentWallet.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Filters */}
        <div className="flex justify-center space-x-4 mb-6">
          {["all", "Credit", "Debit"].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className={`
        px-4 py-2 rounded-full transition-all duration-300 border
        ${
          activeFilter === filter
            ? "bg-black text-white"
            : "bg-white text-black hover:bg-neutral-100 border-neutral-300"
        }
      `}
            >
              {filter === "all" ? "All" : filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {currentWallet.transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-neutral-100 rounded-xl p-4 flex items-center justify-between hover:bg-neutral-200 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                    p-3 rounded-full
                    ${
                      transaction.transactionType === "Credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {transaction.transactionType === "Credit" ? (
                    <ArrowDownLeft className="w-6 h-6" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-neutral-500">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`
                    font-bold
                    ${
                      transaction.transactionType === "Credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {transaction.transactionType === "Credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <p
                  className={`
                    text-sm
                    ${
                      transaction.transactionStatus === "Success"
                        ? "text-green-600"
                        : transaction.transactionStatus === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  `}
                >
                  {transaction.transactionStatus}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {currentWallet.transactions.length > 0 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
             disabled={currentPage === 1}
              className="
                p-2 rounded-full border
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-neutral-100 transition-all
              "
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <span className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
              className="
                p-2 rounded-full border
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-neutral-100 transition-all
              "
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* No Transactions Message */}
        {currentWallet.transactions.length === 0 && (
          <div className="text-center bg-neutral-100 rounded-xl p-8">
            <CreditCard className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletComponent;
