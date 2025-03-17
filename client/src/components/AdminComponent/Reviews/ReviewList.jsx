import { getReviews } from "@/Api/Admin/reviewApi";
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSort,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaEye,
} from "react-icons/fa";

const AdminReviewPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReview, setExpandedReview] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: "newest",
    rating: 0,
    search: "",
    sortField: "",
    sortOrder: "",
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters,
      }).toString();

      const response = await getReviews(queryParams);
      console.log(response)
      if (response.success) {
        setReviews(response.reviews);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters]);

  // Update filters handler
  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Column sort handler
  const handleColumnSort = (field) => {
    const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
    handleFilterChange({
      sortField: field,
      sortOrder: newOrder,
      sortBy: "",
    });
  };

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="text-yellow-500" />
      ) : (
        <FaRegStar key={i} className="text-yellow-500" />
      )
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle expanded review
  const toggleExpandReview = (id) => {
    if (expandedReview === id) {
      setExpandedReview(null);
    } else {
      setExpandedReview(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto ml-64">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Reviews
      </h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, product, or review content..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative inline-block">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
            <FaSort className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative inline-block">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.rating}
              onChange={(e) =>
                handleFilterChange({ rating: Number(e.target.value) })
              }
            >
              <option value="0">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold text-green-600">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">5-Star Reviews</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reviews.filter((review) => review.rating === 5).length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Critical Reviews</p>
          <p className="text-2xl font-bold text-red-600">
            {reviews.filter((review) => review.rating <= 2).length}
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("userName")}
                >
                  <div className="flex items-center">
                    User
                    {filters.key === "userName" &&
                      (filters.direction === "asc" ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("productName")}
                >
                  <div className="flex items-center">
                    Product
                    {filters.key === "productName" &&
                      (filters.direction === "asc" ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("rating")}
                >
                  <div className="flex items-center">
                    Rating
                    {filters.key === "rating" &&
                      (filters.direction === "asc" ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {filters.key === "createdAt" &&
                      (filters.direction === "asc" ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <React.Fragment key={review._id}>
                  <tr
                    className={`hover:bg-gray-50 ${
                      expandedReview === review._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {review.user.firstName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {review.user._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                          <img
                            src={ review.product.images[0] || "/placeholder.svg"}
                            alt=""
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {review.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {review.product._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {review.rating}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.reviewText}
                      </div>
                      <button
                        onClick={() => toggleExpandReview(review._id)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        {expandedReview === review._id
                          ? "Hide full review"
                          : "View full review"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>
                  </tr>
                  {expandedReview === review._id && (
                    <tr className="bg-blue-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="text-sm text-gray-800 bg-white p-4 rounded border border-blue-100">
                          <p className="font-medium mb-2">Full Review:</p>
                          <p>{review.reviewText}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              &laquo;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminReviewPanel;
