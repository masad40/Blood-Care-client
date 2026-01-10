import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from "recharts";

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
          { params: { limit: 5, page: 1 } }
        );
        setMyRecentRequests(res.data.requests || []);
      } else {
        const [usersRes, requestsRes, fundingRes] = await Promise.all([
          axios.get("https://blood-donation-server-tan.vercel.app/users"),
          axios.get("https://blood-donation-server-tan.vercel.app/donation-requests/count"),
          axios.get("https://blood-donation-server-tan.vercel.app/fundings"),
        ]);

        newStats.totalUsers = usersRes.data.totalUsers || 0;
        newStats.totalRequests = requestsRes.data.totalRequests || 0;
        newStats.totalFunding = fundingRes.data.totalFunding || 0;
      }
    } catch (err) {
      toast.error("Failed to load some dashboard data");
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

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: "badge-warning",
      inprogress: "badge-info",
      done: "badge-success",
      canceled: "badge-error",
    };
    return (
      <span className={`badge ${classes[status] || "badge-ghost"} capitalize font-medium`}>
        {status}
      </span>
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Request updated to ${newStatus}!`);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Sample chart data (real data দিয়ে রিপ্লেস করতে পারো)
  const pieData = [
    { name: "Pending", value: 12 },
    { name: "In Progress", value: 8 },
    { name: "Done", value: 25 },
    { name: "Canceled", value: 3 },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="alert alert-error shadow-2xl max-w-2xl text-center p-12 rounded-3xl">
          <span className="text-3xl font-bold">Your account is blocked</span>
          <p className="mt-6 text-xl">You cannot access dashboard features. Please contact admin.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare Dashboard - {role?.charAt(0).toUpperCase() + role?.slice(1) || "User"}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Welcome back, {truncateText(user?.displayName || user?.name || "User", 20)}! 🩸
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Role: <span className="font-extrabold capitalize">{role}</span>
          </p>
        </div>

        {/* Donor Specific - Recent Requests */}
        {role === "donor" && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Your Recent Requests
              </h2>
              <Link
                to="/dashboard/my-donation-requests"
                className="btn btn-outline btn-error"
              >
                View All Requests →
              </Link>
            </div>

            {myRecentRequests.length === 0 ? (
              <div className="card bg-base-100 dark:bg-gray-800 shadow-xl text-center p-12">
                <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">
                  No requests created yet.
                </p>
                <Link to="/dashboard/createRequest" className="btn btn-error btn-lg">
                  Create Your First Request
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto bg-base-100 dark:bg-gray-800 rounded-2xl shadow-xl">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th>Recipient</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecentRequests.map((req) => (
                      <tr key={req._id} className="hover">
                        <td className="font-medium">{truncateText(req.recipientName, 25)}</td>
                        <td>{truncateText(`${req.upazila}, ${req.district}`, 30)}</td>
                        <td>{new Date(req.donationDate).toLocaleDateString()}</td>
                        <td>
                          <span className="badge badge-error">{req.bloodGroup}</span>
                        </td>
                        <td>{getStatusBadge(req.status)}</td>
                        <td>
                          <Link
                            to={`/dashboard/request-details/${req._id}`}
                            className="btn btn-sm btn-info"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Admin/Volunteer Statistics + Charts */}
        {(role === "admin" || role === "volunteer") && (
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Platform Overview
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="stat bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-8 text-center">
                <div className="stat-title text-white/90 text-xl">Total Users</div>
                <div className="stat-value text-5xl font-extrabold mt-4">
                  {stats.totalUsers.toLocaleString()}
                </div>
              </div>

              <div className="stat bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl shadow-xl p-8 text-center">
                <div className="stat-title text-white/90 text-xl">Total Funding</div>
                <div className="stat-value text-5xl font-extrabold mt-4">
                  ৳{stats.totalFunding.toLocaleString()}
                </div>
              </div>

              <div className="stat bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl shadow-xl p-8 text-center">
                <div className="stat-title text-white/90 text-xl">Total Requests</div>
                <div className="stat-value text-5xl font-extrabold mt-4">
                  {stats.totalRequests.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Bar Chart - Sample */}
              <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Request Status Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="card bg-base-100 dark:bg-gray-800 shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Request Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Dashboard;