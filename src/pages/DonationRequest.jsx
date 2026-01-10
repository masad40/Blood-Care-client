import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
        params: { page, limit: 9 },
      });
      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      toast.error("Failed to load urgent requests");
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
      toast.error("Please login to view details & help");
      navigate("/login");
    } else {
      navigate(`/dashboard/request-details/${id}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchPendingRequests(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="card bg-base-100 dark:bg-gray-800 shadow-xl animate-pulse">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div className="h-8 bg-base-300 rounded w-3/4"></div>
          <div className="h-8 w-20 bg-base-300 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-base-300 rounded w-full"></div>
          <div className="h-5 bg-base-300 rounded w-5/6"></div>
          <div className="h-5 bg-base-300 rounded w-4/6"></div>
        </div>
        <div className="mt-6 h-12 bg-base-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Urgent Blood Requests | BloodCare</title>
        <meta name="description" content="See urgent blood donation requests and help save lives today." />
      </Helmet>

      <div className="min-h-screen bg-base-200 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-red-600 dark:text-red-500 mb-6">
              🩸 Urgent Blood Requests
            </h1>
            <p className="text-xl sm:text-2xl text-base-content/80 max-w-3xl mx-auto">
              Someone needs your help right now. Find matching requests near you.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : requests.length === 0 ? (
            <div className="card bg-base-100 dark:bg-gray-800 shadow-2xl text-center p-16 rounded-3xl">
              <h2 className="text-3xl font-bold mb-6 text-base-content/80">
                No Urgent Requests Right Now
              </h2>
              <p className="text-lg mb-10 text-base-content/70">
                That's a good sign! No one is waiting desperately at the moment.
              </p>
              {user ? (
                <Link
                  to="/dashboard/createRequest"
                  className="btn btn-error btn-lg text-xl px-12 shadow-xl hover:shadow-2xl transition"
                >
                  Create a Request →
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-error btn-lg text-xl px-12 shadow-xl hover:shadow-2xl transition"
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
                    className="card bg-base-100 dark:bg-gray-800 shadow-xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border border-base-200 dark:border-gray-700"
                  >
                    <div className="card-body p-6">
                      <div className="flex justify-between items-start mb-5">
                        <h2 className="card-title text-2xl font-bold text-base-content truncate max-w-[70%]">
                          {req.recipientName}
                        </h2>
                        <div className="badge badge-error badge-lg text-white font-bold">
                          {req.bloodGroup}
                        </div>
                      </div>

                      <div className="space-y-3 text-base-content/80 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Location:</span>
                          {req.upazila}, {req.district}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Hospital:</span>
                          {req.hospital}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Date:</span>
                          {new Date(req.donationDate).toLocaleDateString("en-GB")}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Time:</span>
                          {req.donationTime}
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="btn btn-outline btn-error btn-wide sm:btn-md"
                  >
                    Previous
                  </button>

                  <span className="text-lg font-medium text-base-content/80">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="btn btn-outline btn-error btn-wide sm:btn-md"
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