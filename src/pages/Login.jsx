import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    signInUser(email, password)
      .then(() => navigate(from, { replace: true }))
      .catch(() => setError("Invalid email or password. Please try again."));
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Login</title>
        <meta name="description" content="Log in to your BloodCare account to manage donation requests, search donors, and help save lives." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-500">
        <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="card-body p-8 lg:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Log in to continue saving lives with BloodCare
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="label text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full text-lg px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                  required
                />
              </div>

              <div>
                <label className="label text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full text-lg px-5 py-4 pr-14 rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-error shadow-lg rounded-xl">
                  <span className="text-white font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-error w-full text-xl font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Log In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-red-600 dark:text-red-500 hover:underline transition"
                >
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