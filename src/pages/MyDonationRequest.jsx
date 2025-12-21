import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

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
        { params: { page, limit: 10 } }
      );
      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || { currentPage: 1, totalPages: 1, totalRequests: 0 });
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
      await axios.delete(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`);
      toast.success("Request deleted successfully");
      fetchMyRequests(pagination.currentPage);
    } catch (err) {
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
    return <span className={`badge ${styles[status] || "badge-ghost"} capitalize`}>{status}</span>;
  };

  const handlePageChange = (newPage) => {
    fetchMyRequests(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | My Donation Requests</title>
        <meta name="description" content="View and manage all your blood donation requests in one place." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                🩸 My Donation Requests
              </h1>
              <p className="text-xl text-red-100">
                Total: {pagination.totalRequests} request{pagination.totalRequests !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex justify-end mb-8">
                <Link
                  to="/dashboard/createRequest"
                  className="btn btn-error btn-lg text-xl px-8 py-4 shadow-xl hover:shadow-2xl transition"
                >
                  + Create New Request
                </Link>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-10">
                    You haven't created any donation requests yet.
                  </p>
                  <Link
                    to="/dashboard/createRequest"
                    className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
                  >
                    Create Your First Request
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto mb-12">
                    <table className="table table-zebra w-full text-lg">
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
                          <tr key={req._id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                            <td>
                              <div className="font-bold text-xl">{req.recipientName}</div>
                            </td>
                            <td>
                              <div>{req.upazila}, {req.district}</div>
                              <div className="text-sm opacity-70">{req.hospital}</div>
                            </td>
                            <td>
                              <div>{new Date(req.donationDate).toLocaleDateString("en-GB")}</div>
                              <div className="text-sm opacity-70">{req.donationTime}</div>
                            </td>
                            <td>
                              <span className="badge badge-error badge-lg text-white font-bold">
                                {req.bloodGroup}
                              </span>
                            </td>
                            <td>{getStatusBadge(req.status)}</td>
                            <td>
                              <div className="flex flex-wrap gap-3">
                                <Link
                                  to={`/dashboard/request-details/${req._id}`}
                                  className="btn btn-sm btn-info"
                                >
                                  View
                                </Link>
                                {["pending", "inprogress"].includes(req.status) && (
                                  <>
                                    <Link
                                      to={`/dashboard/edit-request/${req._id}`}
                                      className="btn btn-sm btn-warning"
                                    >
                                      Edit
                                    </Link>
                                    <button
                                      onClick={() => handleDelete(req._id)}
                                      className="btn btn-sm btn-error"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile & Tablet Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
                    {requests.map((req) => (
                      <div
                        key={req._id}
                        className="card bg-base-200 dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-shadow"
                      >
                        <div className="card-body">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{req.recipientName}</h3>
                            <span className="badge badge-error badge-lg text-white font-bold">
                              {req.bloodGroup}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Location:</strong> {req.upazila}, {req.district}
                            </p>
                            <p>
                              <strong>Hospital:</strong> {req.hospital}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(req.donationDate).toLocaleDateString("en-GB")}
                            </p>
                            <p>
                              <strong>Time:</strong> {req.donationTime}
                            </p>
                            <p>
                              <strong>Status:</strong> {getStatusBadge(req.status)}
                            </p>
                          </div>

                          <div className="card-actions justify-end mt-6">
                            <Link
                              to={`/dashboard/request-details/${req._id}`}
                              className="btn btn-info"
                            >
                              View Details
                            </Link>
                            {["pending", "inprogress"].includes(req.status) && (
                              <>
                                <Link
                                  to={`/dashboard/edit-request/${req._id}`}
                                  className="btn btn-warning ml-2"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDelete(req._id)}
                                  className="btn btn-error ml-2"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="btn btn-outline btn-error"
                      >
                        Previous
                      </button>

                      <span className="text-lg font-medium">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
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
      </div>
    </>
  );
};

export default MyDonationRequest;