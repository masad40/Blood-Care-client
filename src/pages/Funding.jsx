import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HandHeart, Wallet, Calendar, User } from "lucide-react";

const stripePromise = loadStripe(
  "pk_test_51SgO5hRu68knSUueWGd0W4YjmNFe4TqdaHjuIMWBfsuQOog4OjwO22v0vVh1Yjko39AsLp5aQxsJbLtU3zto9pjB00LTiWtSMM"
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await axios.get(
        "https://blood-donation-server-tan.vercel.app/fundings"
      );
      setFundings(res.data.fundings || []);
      setTotalFunding(res.data.totalFunding || 0);
    } catch (err) {
      toast.error("Failed to load donations");
    } finally {
      setPageLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!amount || parseInt(amount) < 10) {
      toast.error("Minimum donation is ৳10");
      return;
    }

    setIsSubmitting(true);
    const card = elements.getElement(CardElement);

    try {
      const { data } = await axios.post(
        "https://blood-donation-server-tan.vercel.app/create-payment-intent",
        { amount: parseInt(amount) }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card } }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post(
          "https://blood-donation-server-tan.vercel.app/fundings",
          {
            amount: parseInt(amount),
            donorName: user?.displayName || "Anonymous",
            donorEmail: user?.email,
          }
        );

        toast.success("Thank you for your donation 🩷");
        setAmount("");
        card.clear();
        setShowModal(false);
        fetchFundings();
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Support BloodCare | Funding</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 py-16 text-center text-white">
            <h1 className="text-5xl font-black flex justify-center items-center gap-3 mb-4">
              <HandHeart className="w-12 h-12 animate-pulse" />
              Support BloodCare
            </h1>
            <p className="opacity-90 max-w-2xl mx-auto">
              Your donation helps save lives across Bangladesh.
            </p>

            <div className="mt-10 inline-block bg-white/20 rounded-3xl px-12 py-8">
              <p className="text-xl">Total Collected</p>
              <p className="text-5xl font-extrabold">
                ৳{totalFunding.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Donate Button */}
          <div className="text-center py-12 bg-gray-100 dark:bg-gray-700">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-error btn-lg text-xl px-12 flex gap-2 mx-auto hover:scale-105 transition"
            >
              <Wallet /> Donate Now
            </button>
          </div>

          {/* Table */}
          <div className="p-8">
            <h2 className="text-4xl font-bold text-center mb-10">
              Recent Donations
            </h2>

            {fundings.length === 0 ? (
              <p className="text-center text-xl opacity-70">No donations yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr className="bg-red-100 dark:bg-red-900/30">
                      <th>
                        <div className="flex items-center gap-2">
                          <User size={18} />
                          Donor
                        </div>
                      </th>

                      <th>
                        <div className="flex items-center gap-2">
                          <Wallet size={18} />
                          Amount
                        </div>
                      </th>

                      <th>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} />
                          Date
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {fundings.map((f) => (
                      <tr key={f._id}>
                        <td>{f.donorName}</td>
                        <td className="font-bold text-green-600">
                          ৳{f.amount}
                        </td>
                        <td>
                          {new Date(f.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <HandHeart className="text-red-500" /> Make a Donation
            </h3>

            <form onSubmit={handlePayment} className="space-y-6">
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Amount (৳)"
                required
              />

              <div className="border rounded-xl p-4">
                <CardElement />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-error w-full"
              >
                {isSubmitting ? "Processing..." : "Complete Donation"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-ghost w-full"
              >
                Cancel
              </button>
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
