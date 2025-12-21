import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const RequestDetails = () => {
  const { user, role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      toast.error("Failed to load request details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}/donate`, {
        donorName: user?.displayName || user?.name || "Anonymous",
        donorEmail: user?.email,
        status: "inprogress",
      });
      toast.success("Thank you for your kindness! Donation confirmed 🩸");
      setShowDonateModal(false);
      fetchRequestDetails();
    } catch (err) {
      toast.error("Failed to confirm donation. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;

    try {
      await axios.delete(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`);
      toast.success("Request deleted successfully");
      navigate("/dashboard/my-donation-requests");
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
    return <span className={`badge badge-lg ${styles[status] || "badge-ghost"} capitalize font-bold`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">Request Not Found</p>
          <Link to="/donation-requests" className="btn btn-error mt-6">Back to Requests</Link>
        </div>
      </div>
    );
  }

  const isRequester = request.requesterEmail === user?.email;
  const canEditDelete = isRequester || role === "admin";

  return (
    <>
      <Helmet>
        <title>BloodCare | Request Details - {request.recipientName}</title>
        <meta name="description" content={`Urgent blood donation request for ${request.recipientName} (${request.bloodGroup}) in ${request.district}.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-16 text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Blood Donation Request
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-2xl">
                <span className="badge badge-lg bg-white text-red-600 font-bold px-8 py-4">
                  {request.bloodGroup}
                </span>
                {getStatusBadge(request.status)}
              </div>
            </div>

            <div className="p-8 lg:p-16 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Recipient Details
                    </h3>
                    <p className="text-lg"><strong>Name:</strong> {request.recipientName}</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Location & Hospital
                    </h3>
                    <div className="space-y-2 text-lg">
                      <p><strong>District:</strong> {request.district}</p>
                      <p><strong>Upazila:</strong> {request.upazila}</p>
                      <p><strong>Hospital:</strong> {request.hospital}</p>
                      <p><strong>Full Address:</strong> {request.fullAddress}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Donation Schedule
                    </h3>
                    <div className="space-y-2 text-lg">
                      <p><strong>Date:</strong> {new Date(request.donationDate).toLocaleDateString("en-GB")}</p>
                      <p><strong>Time:</strong> {request.donationTime}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Requester Information
                    </h3>
                    <div className="space-y-2 text-lg">
                      <p><strong>Name:</strong> {request.requesterName}</p>
                      <p><strong>Email:</strong> {request.requesterEmail}</p>
                    </div>
                  </div>

                  {request.status === "inprogress" && request.donorName && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-2xl">
                      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                        Current Donor
                      </h3>
                      <div className="space-y-2 text-lg">
                        <p><strong>Name:</strong> {request.donorName}</p>
                        <p><strong>Email:</strong> {request.donorEmail}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Why Blood is Needed
                    </h3>
                    <p className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-lg leading-relaxed">
                      {request.requestMessage || "No additional message provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-10 border-t border-gray-300 dark:border-gray-700">
                {request.status === "pending" && (
                  <button
                    onClick={() => setShowDonateModal(true)}
                    className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    I Want to Donate 🩸
                  </button>
                )}

                {canEditDelete && request.status !== "done" && request.status !== "canceled" && (
                  <>
                    <Link
                      to={`/dashboard/edit-request/${request._id}`}
                      className="btn btn-warning btn-lg text-xl px-10 py-5 shadow-xl hover:shadow-2xl transition"
                    >
                      Edit Request
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="btn btn-ghost btn-lg text-xl text-error border-error hover:bg-error hover:text-white transition"
                    >
                      Delete Request
                    </button>
                  </>
                )}

                <Link
                  to="/donation-requests"
                  className="btn btn-outline btn-lg text-xl px-10 py-5"
                >
                  ← Back to All Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Confirmation Modal */}
      {showDonateModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg bg-white dark:bg-gray-800">
            <h3 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-8">
              Confirm Your Donation
            </h3>

            <div className="space-y-6 text-lg">
              <p className="text-center">
                You are about to confirm donation for:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-center">
                <p className="text-2xl font-bold">{request.recipientName}</p>
                <p className="text-xl mt-2">
                  <span className="badge badge-error badge-lg text-white">{request.bloodGroup}</span>
                </p>
                <p className="mt-4"><strong>Location:</strong> {request.hospital}, {request.upazila}, {request.district}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl">
                <p className="font-semibold mb-3">Your Information (as Donor):</p>
                <p><strong>Name:</strong> {user?.displayName || user?.name || "Anonymous"}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>

              <p className="text-center font-medium">
                After confirmation, the status will change to <strong>"In Progress"</strong>.
              </p>
            </div>

            <div className="modal-action flex justify-center gap-6 mt-10">
              <button
                onClick={handleDonate}
                className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
              >
                Yes, I Will Donate
              </button>
              <button
                onClick={() => setShowDonateModal(false)}
                className="btn btn-ghost btn-lg text-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDetails;