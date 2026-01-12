import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trash2, Edit2, Eye, Plus } from "lucide-react";

const MyDonationRequest = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
  });

  const fetchMyRequests = async (page = 1) => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://blood-donation-server-tan.vercel.app/donation-requests/my-requests/${user.email}`,
        {
          params: { page, limit: 10 },
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
      toast.error("Failed to load your requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchMyRequests(1);
    }
  }, [user, authLoading]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`
      );
      toast.success("Request deleted successfully");
      fetchMyRequests(pagination.currentPage);
    } catch {
      toast.error("Failed to delete request");
    }
  };


  const getStatusBadge = (status) => {
    const styles = {
      pending: "badge-warning",
      inprogress: "badge-info",
      done: "badge-success",
      canceled: "badge-error",
    };
    return (
      <span
        className={`badge ${styles[status] || "badge-ghost"} uppercase px-4 py-2 font-semibold`}
      >
        {status}
      </span>
    );
  };

  const handlePageChange = (page) => {
    fetchMyRequests(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | My Donation Requests</title>
        <meta
          name="description"
          content="View and manage all your blood donation requests in one place."
        />
      </Helmet>

  
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 flex justify-center items-center gap-2">
                <Plus size={36} />
                🩸 My Donation Requests
              </h1>
              <p className="text-xl text-red-100">
                Total: {pagination.totalRequests} request
                {pagination.totalRequests !== 1 && "s"}
              </p>
            </div>

            <div className="p-8 lg:p-12">
  
              <div className="flex justify-end mb-8">
                <Link
                  to="/dashboard/createRequest"
                  className="btn btn-error btn-lg shadow-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create New Request
                </Link>
              </div>

    
              {requests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-20"
                >
                  <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
                    You haven't created any donation requests yet.
                  </p>
                  <Link
                    to="/dashboard/createRequest"
                    className="btn btn-error btn-lg"
                  >
                    Create Your First Request
                  </Link>
                </motion.div>
              ) : (
                <>
                
                  <div className="hidden lg:block overflow-x-auto mb-12">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr className="bg-red-100 dark:bg-red-900/30">
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
                          <motion.tr
                            key={req._id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="cursor-pointer"
                          >
                            <td className="font-bold">{req.recipientName}</td>
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
                              <span className="badge badge-error text-white font-bold">
                                {req.bloodGroup}
                              </span>
                            </td>
                            <td>{getStatusBadge(req.status)}</td>
                            <td className="space-x-2">
                              <Link
                                to={`/dashboard/request-details/${req._id}`}
                                className="btn btn-sm btn-info flex items-center gap-1"
                              >
                                <Eye size={16} /> View
                              </Link>

                              {["pending", "inprogress"].includes(
                                req.status
                              ) && (
                                <>
                                  <Link
                                    to={`/dashboard/edit-request/${req._id}`}
                                    className="btn btn-sm btn-warning flex items-center gap-1"
                                  >
                                    <Edit2 size={16} /> Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(req._id)}
                                    className="btn btn-sm btn-error flex items-center gap-1"
                                  >
                                    <Trash2 size={16} /> Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                    {requests.map((req) => (
                      <motion.div
                        key={req._id}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="card bg-base-200 dark:bg-gray-700 shadow-xl"
                      >
                        <div className="card-body">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-lg">
                              {req.recipientName}
                            </h3>
                            <span className="badge badge-error text-white">
                              {req.bloodGroup}
                            </span>
                          </div>

                          <p>
                            <strong>Location:</strong> {req.upazila},{" "}
                            {req.district}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(req.donationDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                          <p>
                            <strong>Status:</strong> {getStatusBadge(req.status)}
                          </p>

                          <div className="card-actions justify-end mt-4 space-x-2">
                            <Link
                              to={`/dashboard/request-details/${req._id}`}
                              className="btn btn-info btn-sm flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </Link>
                            {["pending", "inprogress"].includes(
                              req.status
                            ) && (
                              <>
                                <Link
                                  to={`/dashboard/edit-request/${req._id}`}
                                  className="btn btn-warning btn-sm flex items-center gap-1"
                                >
                                  <Edit2 size={14} /> Edit
                                </Link>
                                <button
                                  onClick={() => handleDelete(req._id)}
                                  className="btn btn-error btn-sm flex items-center gap-1"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-10">
                      <button
                        disabled={pagination.currentPage === 1}
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        className={`btn btn-outline btn-error flex items-center gap-2 ${
                          pagination.currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
             
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </button>

                      <span className="text-lg font-medium mt-2">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        className={`btn btn-outline btn-error flex items-center gap-2 ${
                          pagination.currentPage === pagination.totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Next
                    
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MyDonationRequest;
