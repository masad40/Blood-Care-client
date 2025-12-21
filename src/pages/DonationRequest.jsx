import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const DonationRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const fetchPendingRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("https://blood-donation-server-tan.vercel.app/donation-requests/public", {
        params: { page, limit: 9, status: "pending" },
      });
      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      toast.error("Failed to load donation requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests(1);
  }, []);

  const handleViewDetails = (id) => {
    if (!user) {
      toast.error("Please login to view request details");
      navigate("/login");
    } else {
      navigate(`/dashboard/request-details/${id}`);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPendingRequests(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | Urgent Blood Donation Requests</title>
        <meta name="description" content="Find urgent blood donation requests near you and help save lives today." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-500 mb-6">
              🩸 Urgent Blood Donation Requests
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Help save lives – find someone who needs your blood type today.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-20 bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl">
              <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-10">
                No urgent blood donation requests at the moment.
              </p>
              {user ? (
                <Link
                  to="/dashboard/createRequest"
                  className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
                >
                  Create a Request
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
                >
                  Login to Help
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="card bg-base-100 dark:bg-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="card-title text-2xl text-gray-800 dark:text-white">
                          {req.recipientName}
                        </h2>
                        <span className="badge badge-error badge-lg text-white font-bold">
                          {req.bloodGroup}
                        </span>
                      </div>

                      <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p className="flex items-center gap-2">
                          <strong>Location:</strong> {req.upazila}, {req.district}
                        </p>
                        <p className="flex items-center gap-2">
                          <strong>Hospital:</strong> {req.hospital}
                        </p>
                        <p className="flex items-center gap-2">
                          <strong>Date:</strong>{" "}
                          {new Date(req.donationDate).toLocaleDateString("en-GB")}
                        </p>
                        <p className="flex items-center gap-2">
                          <strong>Time:</strong> {req.donationTime}
                        </p>
                      </div>

                      <div className="card-actions mt-8">
                        <button
                          onClick={() => handleViewDetails(req._id)}
                          className="btn btn-error btn-block text-lg font-semibold shadow-lg hover:shadow-xl transition"
                        >
                          View Details & Help
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="btn btn-outline btn-error btn-wide"
                  >
                    Previous
                  </button>

                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="btn btn-outline btn-error btn-wide"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DonationRequest;