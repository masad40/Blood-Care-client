import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  User,
  MapPin,
  Calendar,
  Droplet,
  Eye,
  Users,
  Wallet,
  ListChecks,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Home,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Shield,
  Heart
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const Dashboard = () => {
  const { user, role, loading: authLoading } = useContext(AuthContext);

  const [myRequests, setMyRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
    activeDonors: 0,
    completedDonations: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // "week", "month", "year"

  /* ---------------- Fetch Data ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);

      if (role === "donor") {
        const res = await axios.get(
          `https://blood-donation-server-tan.vercel.app/donation-requests/my-requests/${user.email}`,
          { params: { limit: 5 } }
        );
        setMyRequests(res.data.requests || []);
      } else {
        const [users, requests, fundings] = await Promise.all([
          axios.get("https://blood-donation-server-tan.vercel.app/users"),
          axios.get("https://blood-donation-server-tan.vercel.app/donation-requests/count"),
          axios.get("https://blood-donation-server-tan.vercel.app/fundings"),
        ]);

        // Mock additional stats for demo
        setStats({
          totalUsers: users.data.totalUsers || 12500,
          totalRequests: requests.data.totalRequests || 9200,
          totalFunding: fundings.data.totalFunding || 1250000,
          activeDonors: 4500,
          completedDonations: 8300,
          pendingRequests: 280
        });
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email && role) {
      fetchData();
    }
  }, [authLoading, user, role]);

  /* ---------------- Helpers ---------------- */
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <Clock className="h-3 w-3" />
      },
      inprogress: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <Activity className="h-3 w-3" />
      },
      done: {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="h-3 w-3" />
      },
      canceled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: <AlertCircle className="h-3 w-3" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /* ---------------- Chart Data ---------------- */
  const weeklyData = [
    { day: "Mon", requests: 42, donations: 38 },
    { day: "Tue", requests: 48, donations: 42 },
    { day: "Wed", requests: 52, donations: 48 },
    { day: "Thu", requests: 45, donations: 41 },
    { day: "Fri", requests: 58, donations: 52 },
    { day: "Sat", requests: 65, donations: 58 },
    { day: "Sun", requests: 48, donations: 44 },
  ];

  const monthlyData = [
    { month: "Jan", requests: 320, donations: 290 },
    { month: "Feb", requests: 380, donations: 350 },
    { month: "Mar", requests: 420, donations: 390 },
    { month: "Apr", requests: 480, donations: 450 },
    { month: "May", requests: 520, donations: 490 },
    { month: "Jun", requests: 580, donations: 540 },
  ];

  const statusDistribution = [
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "In Progress", value: 8, color: "#3b82f6" },
    { name: "Completed", value: 20, color: "#10b981" },
    { name: "Canceled", value: 4, color: "#ef4444" },
  ];

  const bloodGroupDistribution = [
    { name: "A+", value: 28, color: "#dc2626" },
    { name: "B+", value: 24, color: "#7c3aed" },
    { name: "O+", value: 32, color: "#059669" },
    { name: "AB+", value: 8, color: "#d97706" },
    { name: "Others", value: 8, color: "#475569" },
  ];

  const getChartData = () => {
    return timeRange === "week" ? weeklyData : monthlyData;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <Droplet className="h-16 w-16 text-red-600 animate-pulse" />
          <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl"></div>
        </div>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | BloodCare</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
          {/* ---------------- Header ---------------- */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="capitalize">{role}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, <span className="text-red-600 dark:text-red-500">{user?.displayName?.split(' ')[0] || "User"}</span> 👋
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Here's what's happening with your account today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  className="btn btn-ghost btn-sm flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                {role === "admin" && (
                  <button className="btn btn-error btn-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                )}
              </div>
            </div>

            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 sm:p-8 text-white shadow-xl mb-8"
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {role === "admin" ? "Administrator" : role === "volunteer" ? "Volunteer" : "Blood Donor"}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      Saving Lives Together
                    </h2>
                    <p className="text-red-100/80">
                      Your contributions are making a real difference in people's lives.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Heart className="h-5 w-5" />
                      <span className="font-semibold">{role === "donor" ? "Active Donor" : "Platform Manager"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </motion.div>
          </div>

          {/* ---------------- DONOR DASHBOARD ---------------- */}
          {role === "donor" && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "My Requests", value: myRequests.length, icon: ListChecks, color: "bg-blue-500" },
                  { label: "Completed", value: myRequests.filter(r => r.status === "done").length, icon: CheckCircle, color: "bg-green-500" },
                  { label: "Pending", value: myRequests.filter(r => r.status === "pending").length, icon: Clock, color: "bg-yellow-500" },
                  { label: "Donations", value: 12, icon: Droplet, color: "bg-red-500" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Requests & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Requests */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Donation Requests
                    </h2>
                    <Link to="/dashboard/my-requests" className="text-sm text-red-600 dark:text-red-500 font-medium flex items-center gap-1">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {myRequests.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                      <Droplet className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No requests found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You haven't created any donation requests yet.
                      </p>
                      <Link to="/dashboard/createRequest" className="btn btn-error inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create First Request
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Recipient</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {myRequests.map((req, i) => (
                              <motion.tr
                                key={req._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900 dark:text-white">{req.recipientName}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Blood: <span className="font-semibold">{req.bloodGroup}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="truncate max-w-[120px]">{req.upazila}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {new Date(req.donationDate).toLocaleDateString('en-GB')}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(req.status)}
                                </td>
                                <td className="px-6 py-4">
                                  <Link
                                    to={`/dashboard/request-details/${req._id}`}
                                    className="btn btn-sm btn-ghost hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions & Stats */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link
                        to="/dashboard/createRequest"
                        className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <Plus className="h-4 w-4 text-red-600 dark:text-red-500" />
                          </div>
                          <span className="font-medium">Create New Request</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-600" />
                      </Link>
                      
                      <Link
                        to="/searchDonors"
                        className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                          </div>
                          <span className="font-medium">Search Donors</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </Link>
                      
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <User className="h-4 w-4 text-green-600 dark:text-green-500" />
                          </div>
                          <span className="font-medium">Update Profile</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                      </Link>
                    </div>
                  </div>

                  {/* Donation Stats */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Your Impact
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Lives Saved</span>
                        <span className="font-bold text-gray-900 dark:text-white">36</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Donation</span>
                        <span className="font-bold text-gray-900 dark:text-white">45 days ago</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Next Eligible</span>
                        <span className="font-bold text-green-600 dark:text-green-500">In 15 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- ADMIN / VOLUNTEER DASHBOARD ---------------- */}
          {(role === "admin" || role === "volunteer") && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { 
                    label: "Total Users", 
                    value: stats.totalUsers.toLocaleString(), 
                    icon: Users,
                    change: "+12%",
                    trend: "up",
                    color: "from-blue-500 to-cyan-500"
                  },
                  { 
                    label: "Total Funding", 
                    value: `৳${stats.totalFunding.toLocaleString()}`, 
                    icon: Wallet,
                    change: "+8.5%",
                    trend: "up",
                    color: "from-green-500 to-emerald-500"
                  },
                  { 
                    label: "Active Donors", 
                    value: stats.activeDonors.toLocaleString(), 
                    icon: Users,
                    change: "+5.2%",
                    trend: "up",
                    color: "from-purple-500 to-pink-500"
                  },
                  { 
                    label: "Pending Requests", 
                    value: stats.pendingRequests, 
                    icon: AlertCircle,
                    change: "-3%",
                    trend: "down",
                    color: "from-orange-500 to-red-500"
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Platform Activity
                    </h3>
                    <div className="flex gap-2">
                      {["week", "month", "year"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${timeRange === range
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey={timeRange === "week" ? "day" : "month"} 
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="requests" 
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          fillOpacity={0.2}
                          name="Blood Requests"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="donations" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.2}
                          name="Successful Donations"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Request Status Distribution
                  </h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={statusDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Additional Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blood Group Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Blood Group Distribution
                  </h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bloodGroupDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {bloodGroupDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Quick Statistics
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Average Response Time", value: "28 minutes", icon: Clock },
                      { label: "Success Rate", value: "94.5%", icon: TrendingUp },
                      { label: "Active Campaigns", value: "8", icon: Activity },
                      { label: "Emergency Requests", value: "12", icon: AlertCircle },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${i === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : i === 1 ? 'bg-green-100 dark:bg-green-900/30' : i === 2 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                            <item.icon className={`h-4 w-4 ${i === 0 ? 'text-blue-600 dark:text-blue-500' : i === 1 ? 'text-green-600 dark:text-green-500' : i === 2 ? 'text-purple-600 dark:text-purple-500' : 'text-red-600 dark:text-red-500'}`} />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recent Platform Activity
                  </h3>
                  <button className="text-sm text-red-600 dark:text-red-500 font-medium flex items-center gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { user: "Ahmed Rahim", action: "created new blood request", time: "5 minutes ago", type: "request" },
                    { user: "Nusrat Jahan", action: "completed donation", time: "1 hour ago", type: "donation" },
                    { user: "Sabbir Ahmed", action: "registered as donor", time: "2 hours ago", type: "registration" },
                    { user: "Maria Islam", action: "made a donation", time: "3 hours ago", type: "funding" },
                    { user: "System", action: "scheduled maintenance", time: "5 hours ago", type: "system" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 rounded-lg transition-colors">
                      <div className={`p-2 rounded-full ${activity.type === 'request' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500' : activity.type === 'donation' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500' : activity.type === 'registration' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500'}`}>
                        {activity.type === 'request' ? <Droplet className="h-4 w-4" /> : 
                         activity.type === 'donation' ? <CheckCircle className="h-4 w-4" /> : 
                         activity.type === 'registration' ? <User className="h-4 w-4" /> : 
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;