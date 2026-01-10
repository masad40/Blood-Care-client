import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const AllBloodDonationRequest = () => {
  const { role } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);

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

  // Load districts
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
            limit: 10,
            status: filters.status || undefined,
            bloodGroup: filters.bloodGroup || undefined,
            district: filters.district
              ? filters.district.trim()
              : undefined,
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
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              🩸 All Blood Donation Requests
            </h1>
            <p className="mt-3 text-red-100 text-lg">
              Total: {pagination.totalRequests} requests
            </p>
          </div>

          <div className="p-6 lg:p-10">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>

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

            {requests.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-500 dark:text-gray-400">
                  No blood donation requests found with current filters.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto mb-10">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-red-50 dark:bg-red-900/30 text-lg">
                        <th>Recipient</th>
                        <th>Location</th>
                        <th>Date & Time</th>
                        <th>Blood Group</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req._id}>
                          <td>
                            <div className="font-bold">
                              {req.recipientName}
                            </div>
                            <div className="text-sm opacity-70">
                              by {req.requesterName || "Unknown"}
                            </div>
                          </td>
                          <td>
                            {req.upazila}, {req.district}
                            <div className="text-sm opacity-70">
                              {req.hospital}
                            </div>
                          </td>
                          <td>
                            {new Date(req.donationDate).toLocaleDateString(
                              "en-GB"
                            )}
                            <div className="text-sm opacity-70">
                              {req.donationTime}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-error badge-lg text-white font-bold">
                              {req.bloodGroup}
                            </span>
                          </td>
                          <td>
                            <select
                              value={req.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  req._id,
                                  e.target.value
                                )
                              }
                              className="select select-sm w-full"
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="done">Done</option>
                              <option value="canceled">Canceled</option>
                            </select>
                          </td>
                          <td className="flex gap-2">
                            <Link
                              to={`/dashboard/request-details/${req._id}`}
                              className="btn btn-sm btn-info"
                            >
                              View
                            </Link>
                            {role === "admin" && (
                              <button
                                onClick={() => handleDelete(req._id)}
                                className="btn btn-sm btn-error"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-4 mt-12">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="btn btn-outline btn-error"
                    >
                      Previous
                    </button>
                    <span className="text-lg font-medium">
                      Page {pagination.currentPage} of{" "}
                      {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage ===
                        pagination.totalPages
                      }
                      className="btn btn-outline btn-error"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBloodDonationRequest;
