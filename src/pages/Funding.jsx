import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const stripePromise = loadStripe("pk_test_51SgO5hRu68knSUueWGd0W4YjmNFe4TqdaHjuIMWBfsuQOog4OjwO22v0vVh1Yjko39AsLp5aQxsJbLtU3zto9pjB00LTiWtSMM");

const Funding = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [fundings, setFundings] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    fetchFundings();
  }, [user, authLoading, navigate]);

  const fetchFundings = async () => {
    setPageLoading(true);
    try {
      const res = await axios.get("https://blood-donation-server-tan.vercel.app/fundings");
      setFundings(res.data.fundings || []);
      setTotalFunding(res.data.totalFunding || 0);
    } catch (err) {
      toast.error("Failed to load donations");
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    if (!amount || parseInt(amount) < 10) {
      toast.error("Minimum donation is ৳10");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { data } = await axios.post("https://blood-donation-server-tan.vercel.app/create-payment-intent", {
        amount: parseInt(amount),
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post("https://blood-donation-server-tan.vercel.app/fundings", {
          amount: parseInt(amount),
          donorName: user?.displayName || user?.name || "Anonymous",
          donorEmail: user?.email,
        });

        toast.success("Thank you! Your donation has been recorded 🩷");
        setAmount("");
        cardElement.clear();
        setShowModal(false);
        fetchFundings();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment processing failed. Please try again.");
    }
  };

  // Skeleton Loader
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td><div className="h-6 bg-base-300 rounded w-3/4"></div></td>
      <td><div className="h-6 bg-base-300 rounded w-32"></div></td>
      <td><div className="h-6 bg-base-300 rounded w-40"></div></td>
    </tr>
  );

  if (authLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Support BloodCare | Donate Now</title>
        <meta name="description" content="Support BloodCare Foundation by donating. Every contribution helps save lives." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-16 text-center text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                Support BloodCare Mission
              </h1>
              <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 opacity-90">
                Your donation helps us organize blood drives, raise awareness, and save lives across Bangladesh.
              </p>

              <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl px-12 py-10">
                <div className="stat-title text-white text-2xl mb-2">Total Collected</div>
                <div className="stat-value text-5xl sm:text-6xl font-extrabold">
                  ৳{totalFunding.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-700">
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-error btn-lg text-xl sm:text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
              >
                Donate Now 🩷
              </button>
            </div>

            {/* Recent Donations */}
            <div className="p-6 lg:p-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-12">
                Recent Donations
              </h2>

              {fundings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400">
                    No donations yet. Be the first to contribute!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full text-base sm:text-lg">
                    <thead>
                      <tr className="bg-red-100 dark:bg-red-900/30">
                        <th>Donor</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundings.map((f) => (
                        <tr key={f._id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                          <td className="font-semibold">{f.donorName}</td>
                          <td className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                            ৳{f.amount.toLocaleString()}
                          </td>
                          <td>{new Date(f.createdAt).toLocaleDateString("en-GB")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg w-full mx-4 bg-base-100 dark:bg-gray-800">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-8">
              Make a Donation
            </h3>

            <form onSubmit={handlePayment} className="space-y-8">
              <div>
                <label className="label text-lg font-semibold">Donation Amount (BDT)</label>
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min ৳10)"
                  className="input input-bordered input-lg w-full text-lg"
                  required
                />
              </div>

              <div>
                <label className="label text-lg font-semibold">Card Information</label>
                <div className="p-4 sm:p-6 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "18px",
                          color: "#32325d",
                          "::placeholder": { color: "#aab7c4" },
                        },
                        invalid: { color: "#fa755a" },
                      },
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Test card: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">4242 4242 4242 4242</code> • Any future date • Any CVC
                </p>
              </div>

              <div className="modal-action flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={!stripe || !amount || isSubmitting}
                  className="btn btn-error btn-lg w-full text-lg font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    "Complete Donation"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setAmount("");
                    elements?.getElement(CardElement)?.clear();
                  }}
                  className="btn btn-ghost btn-lg w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const FundingWithStripe = () => (
  <Elements stripe={stripePromise}>
    <Funding />
  </Elements>
);

export default FundingWithStripe;