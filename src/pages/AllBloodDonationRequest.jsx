import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Droplet,
  Trash2,
  User,
  MapPin,
  Calendar,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban
} from "lucide-react";

const AllBloodDonationRequest = () => {
  const { role } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentView, setCurrentView] = useState("table"); // "table" or "card"

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    bloodGroup: "",
    district: "",
  });

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []))
      .catch((err) => console.error("Failed to load districts:", err));
  }, []);

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://blood-donation-server-tan.vercel.app/donation-requests",
        {
          params: {
            page,
            limit: 12,
            status: filters.status || undefined,
            bloodGroup: filters.bloodGroup || undefined,
            district: filters.district ? filters.district.trim() : undefined,
            search: searchQuery || undefined,
          },
        }
      );

      setRequests(res.data.requests || []);
      setPagination(
        res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRequests: 0,
        }
      );
    } catch (err) {
      toast.error("Failed to load requests");
      console.error(err);
    } finally {
      setLoading(false);
      setShowMobileFilters(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchQuery]);

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchRequests(newPage);
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}/status`,
        { status: newStatus }
      );
      toast.success("Status updated successfully!");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`
      );
      toast.success("Request deleted successfully");
      fetchRequests(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to delete request");
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      bloodGroup: "",
      district: "",
    });
    setSearchQuery("");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "inprogress":
        return <AlertCircle className="h-4 w-4" />;
      case "done":
        return <CheckCircle className="h-4 w-4" />;
      case "canceled":
        return <Ban className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "inprogress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "inprogress":
        return "In Progress";
      case "done":
        return "Completed";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <Droplet className="h-16 w-16 text-red-600 animate-pulse" />
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl"></div>
        </div>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 animate-pulse">
          Loading donation requests...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | All Blood Donation Requests</title>
        <meta
          name="description"
          content="View and manage all blood donation requests in BloodCare dashboard."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Droplet className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 dark:text-red-500" />
                  All Blood Requests
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Total: {pagination.totalRequests} requests found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentView("table")}
                    className={`px-4 py-2 rounded-md transition-all ${currentView === "table"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setCurrentView("card")}
                    className={`px-4 py-2 rounded-md transition-all ${currentView === "card"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    Cards
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="sm:hidden btn btn-outline btn-sm flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by recipient name, hospital, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="select select-bordered w-full bg-white dark:bg-gray-800"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
                <option value="canceled">Canceled</option>
              </select>

              <select
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value })
                }
                className="select select-bordered w-full bg-white dark:bg-gray-800"
              >
                <option value="">All Blood Groups</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>

              <select
                value={filters.district}
                onChange={(e) =>
                  setFilters({ ...filters, district: e.target.value })
                }
                className="select select-bordered w-full bg-white dark:bg-gray-800"
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="btn btn-outline btn-error w-full"
            >
              Clear Filters
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="sm:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Blood Group</label>
                    <select
                      value={filters.bloodGroup}
                      onChange={(e) =>
                        setFilters({ ...filters, bloodGroup: e.target.value })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="">All Blood Groups</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">District</label>
                    <select
                      value={filters.district}
                      onChange={(e) =>
                        setFilters({ ...filters, district: e.target.value })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="">All Districts</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="btn btn-outline btn-error w-full mt-6"
                  >
                    Clear All Filters
                  </button>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="btn btn-error w-full"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(filters.status || filters.bloodGroup || filters.district || searchQuery) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm">
                  Status: {getStatusText(filters.status)}
                  <button onClick={() => setFilters({ ...filters, status: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.bloodGroup && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm">
                  Blood: {filters.bloodGroup}
                  <button onClick={() => setFilters({ ...filters, bloodGroup: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.district && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm">
                  District: {filters.district}
                  <button onClick={() => setFilters({ ...filters, district: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-sm">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Content */}
          {requests.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Droplet className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No requests found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery || filters.status || filters.bloodGroup || filters.district
                  ? "Try adjusting your filters or search query"
                  : "No blood donation requests available at the moment"}
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-error"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              {currentView === "table" ? (
                <div className="hidden sm:block overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Recipient</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date & Time</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Blood Group</th>
                          <th className="px6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {requests.map((req) => (
                          <tr key={req._id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 dark:text-white">{req.recipientName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Requested by {req.requesterName || "Anonymous"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-600" />
                                <span>{req.upazila}, {req.district}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{req.hospital}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-red-600" />
                                <span>{new Date(req.donationDate).toLocaleDateString("en-GB")}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{req.donationTime}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 font-semibold">
                                <Droplet className="h-3 w-3" />
                                {req.bloodGroup}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={req.status}
                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                className={`select select-sm w-full ${getStatusColor(req.status)} border-transparent`}
                              >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Completed</option>
                                <option value="canceled">Canceled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/dashboard/request-details/${req._id}`}
                                  className="btn btn-sm btn-ghost hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                  aria-label="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                {role === "admin" && (
                                  <button
                                    onClick={() => handleDelete(req._id)}
                                    className="btn btn-sm btn-ghost hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                    aria-label="Delete request"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Card Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {req.recipientName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Requested by {req.requesterName || "Anonymous"}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {getStatusText(req.status)}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30">
                              <Droplet className="h-5 w-5 text-red-600 dark:text-red-500" />
                            </span>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Blood Group</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{req.bloodGroup}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <MapPin className="h-4 w-4" />
                              Location
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {req.upazila}, {req.district}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <Calendar className="h-4 w-4" />
                              Date
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(req.donationDate).toLocaleDateString("en-GB")}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hospital</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {req.hospital}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <select
                              value={req.status}
                              onChange={(e) => handleStatusChange(req._id, e.target.value)}
                              className={`select select-sm w-32 ${getStatusColor(req.status)} border-transparent`}
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Completed</option>
                              <option value="canceled">Canceled</option>
                            </select>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/dashboard/request-details/${req._id}`}
                                className="btn btn-sm btn-ghost hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              {role === "admin" && (
                                <button
                                  onClick={() => handleDelete(req._id)}
                                  className="btn btn-sm btn-ghost hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Card View (Always cards on mobile) */}
              <div className="sm:hidden space-y-4">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {req.recipientName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {req.requesterName || "Anonymous"}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getStatusColor(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {getStatusText(req.status)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4 text-red-600" />
                            <span className="font-semibold">{req.bloodGroup}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(req.donationDate).toLocaleDateString("en-GB")}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {req.upazila}, {req.district}
                        </div>

                        <div className="text-sm text-gray-500 truncate">
                          {req.hospital}
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <select
                              value={req.status}
                              onChange={(e) => handleStatusChange(req._id, e.target.value)}
                              className={`select select-xs ${getStatusColor(req.status)} border-transparent`}
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Completed</option>
                              <option value="canceled">Canceled</option>
                            </select>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/dashboard/request-details/${req._id}`}
                                className="btn btn-xs btn-ghost"
                              >
                                <Eye className="h-3 w-3" />
                              </Link>
                              {role === "admin" && (
                                <button
                                  onClick={() => handleDelete(req._id)}
                                  className="btn btn-xs btn-ghost"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 sm:mt-12">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {(pagination.currentPage - 1) * 12 + 1} to{" "}
                      {Math.min(pagination.currentPage * 12, pagination.totalRequests)} of{" "}
                      {pagination.totalRequests} requests
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="btn btn-outline btn-sm sm:btn-md gap-2 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${pagination.currentPage === pageNum
                                  ? "bg-red-600 text-white"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                          <>
                            <span className="px-2">...</span>
                            <button
                              onClick={() => handlePageChange(pagination.totalPages)}
                              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {pagination.totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="btn btn-outline btn-sm sm:btn-md gap-2 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllBloodDonationRequest;