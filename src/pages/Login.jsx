import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // ===== Normal Login =====
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

  // ===== Demo Login =====
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
        <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-3xl">
          <div className="card-body p-8 lg:p-12">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Log in to continue saving lives with BloodCare
              </p>
            </div>

            {/* Demo Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                disabled={loading}
                onClick={() =>
                  handleDemoLogin(
                    "tasnifmasad40@gmail.com",
                    "Admin9427",
                    "Admin"
                  )
                }
                className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                Demo Admin Login
              </button>

              <button
                disabled={loading}
                onClick={() =>
                  handleDemoLogin(
                    "tx10pro20@gmail.com",
                    "Volunteer9427",
                    "Volunteer"
                  )
                }
                className="btn w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                Demo Volunteer Login
              </button>

              <button
                disabled={loading}
                onClick={() =>
                  handleDemoLogin(
                    "habibdp06@gmail.com",
                    "Mj9427",
                    "User"
                  )
                }
                className="btn w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Demo User Login
              </button>
            </div>

            <div className="divider">OR</div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="label font-semibold">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full rounded-xl"
                  required
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-error rounded-xl">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-error w-full rounded-xl"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don’t have an account?{" "}
                <Link to="/register" className="text-red-600 font-bold">
                  Register here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
