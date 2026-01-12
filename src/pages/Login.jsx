import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaHeartbeat, FaHandsHelping, FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password, role) => {
    setError("");
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success(`${role} login successful`);
      navigate(from, { replace: true });
    } catch {
      toast.error("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Login</title>
        <meta
          name="description"
          content="Log in to your BloodCare account to manage donation requests, search donors, and help save lives."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12"
        >
         
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="card bg-white dark:bg-gray-800 shadow-2xl rounded-3xl max-w-md mx-auto"
          >
            <div className="card-body p-8 lg:p-12">
            
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h1>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                  Log in to continue saving lives with BloodCare
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  onClick={() =>
                    handleDemoLogin(
                      "tasnifmasad40@gmail.com",
                      "Admin9427",
                      "Admin"
                    )
                  }
                  className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex justify-center gap-3 items-center font-semibold"
                >
                  <FaUserShield /> Demo Admin Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  onClick={() =>
                    handleDemoLogin(
                      "tx10pro20@gmail.com",
                      "Volunteer9427",
                      "Volunteer"
                    )
                  }
                  className="btn w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex justify-center gap-3 items-center font-semibold"
                >
                  <FaHandsHelping /> Demo Volunteer Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  onClick={() =>
                    handleDemoLogin("habibdp06@gmail.com", "Mj9427", "User")
                  }
                  className="btn w-full bg-red-600 hover:bg-red-700 text-white rounded-xl flex justify-center gap-3 items-center font-semibold"
                >
                  <FaHeartbeat /> Demo User Login
                </motion.button>
              </div>

              <div className="divider">OR</div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="label font-semibold">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full rounded-xl"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="label font-semibold">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="input input-bordered w-full pr-14 rounded-xl"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="alert alert-error rounded-xl"
                  >
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-error w-full rounded-xl font-bold"
                >
                  {loading ? "Logging in..." : "Log In"}
                </motion.button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-red-600 font-bold">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden md:flex flex-col justify-center bg-red-600 dark:bg-red-800 rounded-3xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-4xl font-extrabold mb-6">
              Why BloodCare?
            </h2>

            <div className="space-y-8 text-lg leading-relaxed">
              <div className="flex items-center gap-4">
                <FaHeartbeat className="text-5xl" />
                <p>
                  Connect with real donors quickly when time matters most.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FaHandsHelping className="text-5xl" />
                <p>
                  Volunteer and save lives in your community effortlessly.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FaUserShield className="text-5xl" />
                <p>
                  Trusted and secure platform dedicated to blood donation needs.
                </p>
              </div>
            </div>

            <p className="mt-10 italic opacity-90 text-sm max-w-xs">
              Join thousands of heroes making a difference every day with BloodCare.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
