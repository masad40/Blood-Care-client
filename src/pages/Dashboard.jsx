import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, role, loading: authLoading } = useContext(AuthContext);
  const [myRecentRequests, setMyRecentRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    let newStats = { totalUsers: 0, totalFunding: 0, totalRequests: 0 };

    try {
      if (role === "donor") {
        const res = await axios.get(
          `https://blood-donation-server-tan.vercel.app/donation-requests/my-requests/${user.email}`,
          { params: { limit: 3, page: 1 } }
        );
        setMyRecentRequests(res.data.requests || []);
      } else {
        const usersRes = await axios.get("https://blood-donation-server-tan.vercel.app/users");
        const requestsRes = await axios.get("https://blood-donation-server-tan.vercel.app/donation-requests/count");
        const fundingRes = await axios.get("https://blood-donation-server-tan.vercel.app/fundings");

        newStats.totalUsers = usersRes.data.totalUsers || 0;
        newStats.totalRequests = requestsRes.data.totalRequests || 0;
        newStats.totalFunding = fundingRes.data.totalFunding || 0;
      }
    } catch (err) {
      toast.error("Failed to load some data");
      console.error(err);
    } finally {
      setStats(newStats);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email && role) {
      fetchDashboardData();
    }
  }, [user, authLoading, role]);


  const truncateText = (text, maxLength = 25) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: "badge-warning",
      inprogress: "badge-info",
      done: "badge-success",
      canceled: "badge-error",
    };
    return <span className={`badge ${classes[status] || "badge-ghost"} capitalize`}>{status}</span>;
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Request marked as ${newStatus}!`);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
        <div className="alert alert-error shadow-2xl max-w-2xl text-center p-12 rounded-3xl bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-700">
          <span className="text-3xl font-bold text-red-700 dark:text-red-300">Your account is blocked</span>
          <p className="mt-6 text-xl text-red-700 dark:text-red-300">You cannot access dashboard features. Please contact admin.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | Dashboard - {role?.charAt(0).toUpperCase() + role?.slice(1) || "User"}</title>
        <meta name="description" content="Your personal BloodCare dashboard - view recent requests and platform statistics." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Welcome back, {truncateText(user?.displayName || user?.name || "User", 20)}! 🩸
          </h1>
          <p className="text-2xl text-red-100">
            Role: <span className="font-extrabold capitalize">{role}</span>
          </p>
        </div>

        {role === "donor" && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Your Recent Donation Requests
            </h2>

            {myRecentRequests.length === 0 ? (
              <div className="text-center py-20 bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl">
                <p className="text-2xl text-gray-600 dark:text-gray-400 mb-10">
                  You haven't created any donation requests yet.
                </p>
                <Link
                  to="/dashboard/create-donation-request"
                  className="btn btn-error btn-lg text-xl px-12 py-5 shadow-xl hover:shadow-2xl transition"
                >
                  Create Your First Request
                </Link>
              </div>
            ) : (
              <>
                {/* ✅ FIXED DESKTOP TABLE - NO OVERFLOW */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl mb-12 max-w-full">
                    <div className="min-w-[900px]"> {/* Minimum width for proper display */}
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr className="bg-red-100 dark:bg-red-900/30 text-lg">
                            <th className="w-20">Recipient</th>
                            <th className="w-32 max-w-[200px]">Location</th>
                            <th className="w-28">Date & Time</th>
                            <th className="w-24">Blood Group</th>
                            <th className="w-20">Status</th>
                            <th className="w-32 max-w-[180px]">Donor</th>
                            <th className="w-36">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myRecentRequests.map((req) => (
                            <tr key={req._id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                              <td className="font-bold max-w-[120px] truncate" title={req.recipientName}>
                                {truncateText(req.recipientName, 18)}
                              </td>
                              <td className="max-w-[200px]">
                                <div className="max-w-[180px] truncate" title={`${req.upazila}, ${req.district}`}>
                                  {truncateText(`${req.upazila}, ${req.district}`, 25)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-[180px] truncate" title={req.hospital}>
                                  {truncateText(req.hospital, 22)}
                                </div>
                              </td>
                              <td className="max-w-[120px]">
                                <div>{new Date(req.donationDate).toLocaleDateString("en-GB")}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 truncate" title={req.donationTime}>
                                  {truncateText(req.donationTime, 12)}
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-error badge-lg text-white font-bold whitespace-nowrap">
                                  {req.bloodGroup}
                                </span>
                              </td>
                              <td>{getStatusBadge(req.status)}</td>
                              <td className="max-w-[160px]">
                                {req.status === "inprogress" && req.donorName ? (
                                  <div className="space-y-1">
                                    <div className="font-medium truncate max-w-[140px]" title={req.donorName}>
                                      {truncateText(req.donorName, 18)}
                                    </div>
                                    <div 
                                      className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[140px]" 
                                      title={req.donorEmail}
                                    >
                                      {truncateText(req.donorEmail, 20)}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 dark:text-gray-500">-</span>
                                )}
                              </td>
                              <td>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 w-full justify-end">
                                  <Link
                                    to={`/dashboard/request-details/${req._id}`}
                                    className="btn btn-sm btn-info flex-1 sm:flex-none min-w-[70px]"
                                  >
                                    View
                                  </Link>
                                  {req.status === "inprogress" && (
                                    <>
                                      <button
                                        onClick={() => handleStatusChange(req._id, "done")}
                                        className="btn btn-sm btn-success flex-1 sm:flex-none min-w-[70px]"
                                      >
                                        Done
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(req._id, "canceled")}
                                        className="btn btn-sm btn-error flex-1 sm:flex-none min-w-[70px]"
                                      >
                                        Cancel
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
                  </div>
                  
                  
                  <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    📱 <span className="font-semibold">Horizontal scroll available</span> on smaller screens →
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden mb-12">
                  {myRecentRequests.map((req) => (
                    <div key={req._id} className="card bg-base-100 dark:bg-gray-800 shadow-xl">
                      <div className="card-body p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                          <h3 
                            className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-full sm:max-w-[60%]" 
                            title={req.recipientName}
                          >
                            {truncateText(req.recipientName, 28)}
                          </h3>
                          <span className="badge badge-error badge-lg text-white font-bold whitespace-nowrap flex-shrink-0">
                            {req.bloodGroup}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
                          <div className="pt-2">
                            <span className="font-medium">Location:</span>
                            <p className="truncate max-w-full" title={`${req.upazila}, ${req.district}`}>
                              {truncateText(`${req.upazila}, ${req.district}`, 35)}
                            </p>
                          </div>
                          <div className="pt-2">
                            <span className="font-medium">Hospital:</span>
                            <p className="truncate" title={req.hospital}>{truncateText(req.hospital, 40)}</p>
                          </div>
                          <div className="pt-2">
                            <span className="font-medium">Date:</span> {new Date(req.donationDate).toLocaleDateString("en-GB")}
                          </div>
                          <div className="pt-2">
                            <span className="font-medium">Time:</span> {req.donationTime}
                          </div>
                          <div className="pt-2 flex items-center gap-2">
                            <span className="font-medium">Status:</span> 
                            {getStatusBadge(req.status)}
                          </div>
                        </div>
                        {req.status === "inprogress" && req.donorName && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <p className="font-semibold text-sm mb-1">Assigned Donor:</p>
                            <div className="text-sm space-y-1">
                              <p className="truncate" title={req.donorName}>{truncateText(req.donorName, 30)}</p>
                              <p className="truncate text-blue-700 dark:text-blue-300" title={req.donorEmail}>
                                {truncateText(req.donorEmail, 35)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="card-actions justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to={`/dashboard/request-details/${req._id}`}
                            className="btn btn-info w-full sm:w-auto"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center py-8">
                  <Link
                    to="/dashboard/my-donation-requests"
                    className="btn btn-outline btn-error btn-wide btn-lg text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    View All My Requests →
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {(role === "admin" || role === "volunteer") && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Platform Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="stat bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl shadow-2xl p-10 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="stat-title text-white/90 text-xl">Total Users</div>
                <div className="stat-value text-3xl lg:text-5xl font-extrabold mt-4">
                  {stats.totalUsers.toLocaleString()}
                </div>
              </div>

              <div className="stat bg-gradient-to-br from-green-600 to-green-800 text-white rounded-3xl shadow-2xl p-10 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="stat-title text-white/90 text-xl">Total Funding</div>
                <div className="stat-value text-3xl lg:text-4xl font-extrabold mt-4">
                  ৳{stats.totalFunding.toLocaleString()}
                </div>
              </div>

              <div className="stat bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl shadow-2xl p-10 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="stat-title text-white/90 text-xl">Total Requests</div>
                <div className="stat-value text-3xl lg:text-5xl font-extrabold mt-4">
                  {stats.totalRequests.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;