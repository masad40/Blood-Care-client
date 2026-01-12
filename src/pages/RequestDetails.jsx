import { useContext, useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Edit2, Trash2, ArrowLeft, Heart } from "lucide-react";

const STATUS_STYLES = {
  pending: "badge-warning",
  inprogress: "badge-info",
  done: "badge-success",
  canceled: "badge-error",
};

const RequestDetails = () => {
  const { user, role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [processingDonate, setProcessingDonate] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`
      );
      setRequest(res.data);
    } catch (err) {
      toast.error("Failed to load request details");
      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleDonate = async () => {
    if (processingDonate) return;
    setProcessingDonate(true);
    try {
      await axios.patch(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}/donate`,
        {
          donorName: user?.displayName || user?.name || "Anonymous",
          donorEmail: user?.email,
          status: "inprogress",
        }
      );
      toast.success("Thank you for your kindness! Donation confirmed 🩸");
      setShowDonateModal(false);
      fetchRequestDetails();
    } catch (err) {
      toast.error("Failed to confirm donation. Please try again.");
    } finally {
      setProcessingDonate(false);
    }
  };

  const handleDelete = async () => {
    if (processingDelete) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this request?"
    );
    if (!confirmed) return;

    setProcessingDelete(true);
    try {
      await axios.delete(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`
      );
      toast.success("Request deleted successfully");
      navigate("/dashboard/my-donation-requests", { replace: true });
    } catch (err) {
      toast.error("Failed to delete request");
    } finally {
      setProcessingDelete(false);
    }
  };

  const getStatusBadge = (status) => {
    const style = STATUS_STYLES[status] || "badge-ghost";
    return (
      <span
        className={`badge badge-lg ${style} capitalize font-bold`}
        aria-label={`Status: ${status}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            Request Not Found
          </p>
          <Link to="/donation-requests" className="btn btn-error mt-6 flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Requests
          </Link>
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
        <meta
          name="description"
          content={`Urgent blood donation request for ${request.recipientName} (${request.bloodGroup}) in ${request.district}.`}
        />
      </Helmet>

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <section className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      
            <header className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-16 text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Blood Donation Request
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-2xl">
                <span
                  className="badge badge-lg bg-white text-red-600 font-bold px-8 py-4"
                  aria-label={`Blood group ${request.bloodGroup}`}
                >
                  {request.bloodGroup}
                </span>
                {getStatusBadge(request.status)}
              </div>
            </header>

            <div className="p-8 lg:p-16 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
     
                <div className="space-y-6">
              
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Recipient Details
                    </h2>
                    <p className="text-lg">
                      <strong>Name:</strong> {request.recipientName}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Location & Hospital
                    </h2>
                    <div className="space-y-2 text-lg">
                      <p>
                        <strong>District:</strong> {request.district}
                      </p>
                      <p>
                        <strong>Upazila:</strong> {request.upazila}
                      </p>
                      <p>
                        <strong>Hospital:</strong> {request.hospital}
                      </p>
                      <p>
                        <strong>Full Address:</strong> {request.fullAddress}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Donation Schedule
                    </h2>
                    <div className="space-y-2 text-lg">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(request.donationDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                      <p>
                        <strong>Time:</strong> {request.donationTime}
                      </p>
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
         
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Requester Information
                    </h2>
                    <div className="space-y-2 text-lg">
                      <p>
                        <strong>Name:</strong> {request.requesterName}
                      </p>
                      <p>
                        <strong>Email:</strong> {request.requesterEmail}
                      </p>
                    </div>
                  </section>

                  {request.status === "inprogress" && request.donorName && (
                    <section className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-2xl">
                      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                        Current Donor
                      </h2>
                      <div className="space-y-2 text-lg">
                        <p>
                          <strong>Name:</strong> {request.donorName}
                        </p>
                        <p>
                          <strong>Email:</strong> {request.donorEmail}
                        </p>
                      </div>
                    </section>
                  )}

                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Why Blood is Needed
                    </h2>
                    <p className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-lg leading-relaxed">
                      {request.requestMessage || "No additional message provided."}
                    </p>
                  </section>
                </div>
              </div>

              <nav className="flex flex-wrap justify-center gap-6 pt-10 border-t border-gray-300 dark:border-gray-700">
            
                {request.status === "pending" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDonateModal(true)}
                    className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                    aria-label="I want to donate"
                  >
                    <Heart size={24} />
                    I Want to Donate 🩸
                  </motion.button>
                )}

                {canEditDelete &&
                  !["done", "canceled"].includes(request.status) && (
                    <>
                      <Link
                        to={`/dashboard/edit-request/${request._id}`}
                        className="btn btn-warning btn-lg text-xl px-10 py-5 shadow-xl hover:shadow-2xl transition flex items-center gap-2"
                        aria-label="Edit Request"
                      >
                        <Edit2 size={20} />
                        Edit Request
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        disabled={processingDelete}
                        className="btn btn-ghost btn-lg text-xl text-error border-error hover:bg-error hover:text-white transition flex items-center gap-2"
                        aria-label="Delete Request"
                      >
                        {processingDelete ? (
                          <>
                            <Loader2 className="animate-spin" size={20} /> Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={20} />
                            Delete Request
                          </>
                        )}
                      </motion.button>
                    </>
                  )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/donation-requests"
                    className="btn btn-outline btn-lg text-xl px-10 py-5 flex items-center gap-2"
                    aria-label="Back to All Requests"
                  >
                    <ArrowLeft size={20} />
                    <span className="hidden md:block">Back to All</span> Requests
                  </Link>
                  <Link
                    to="/dashboard"
                    className="btn btn-outline btn-lg text-xl px-10 py-5 flex items-center gap-2"
                    aria-label="Back to Dashboard"
                  >
                    <ArrowLeft size={20} />
                   <span className="hidden md:block">Back to</span>  Dashboard
                  </Link>
                </div>
              </nav>
            </div>
          </section>
        </div>
      </motion.main>

      {showDonateModal && (
        <dialog open className="modal modal-open">
          <motion.form
            method="dialog"
            className="modal-box max-w-lg bg-white dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleDonate();
            }}
          >
            <h3 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-8">
              Confirm Your Donation
            </h3>

            <div className="space-y-6 text-lg">
              <p className="text-center">You are about to confirm donation for:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-center">
                <p className="text-2xl font-bold">{request.recipientName}</p>
                <p className="text-xl mt-2">
                  <span className="badge badge-error badge-lg text-white">
                    {request.bloodGroup}
                  </span>
                </p>
                <p className="mt-4">
                  <strong>Location:</strong> {request.hospital}, {request.upazila},{" "}
                  {request.district}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl">
                <p className="font-semibold mb-3">Your Information (as Donor):</p>
                <p>
                  <strong>Name:</strong> {user?.displayName || user?.name || "Anonymous"}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>

              <p className="text-center font-medium">
                After confirmation, the status will change to <strong>"In Progress"</strong>.
              </p>
            </div>

            <div className="modal-action flex justify-center gap-6 mt-10">
              <motion.button
                type="submit"
                disabled={processingDonate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
              >
                {processingDonate ? "Confirming..." : "Yes, I Will Donate"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowDonateModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost btn-lg text-xl"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        </dialog>
      )}
    </>
  );
};

export default RequestDetails;
