import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 md:px-10 sticky top-0 z-50">
      {/* Left - Logo & Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          {/* Mobile Dropdown Menu */}
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-64 z-50">
            <li><NavLink to="/" className="text-lg">Home</NavLink></li>
            <li><NavLink to="/donation-requests" className="text-lg">Donation Requests</NavLink></li>

            {user ? (
              <>
                <li><NavLink to="/funding" className="text-lg">Funding</NavLink></li>
                <li><NavLink to="/dashboard" className="text-lg">Dashboard</NavLink></li>
                <li><button onClick={logOut} className="text-lg text-error">Logout</button></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" className="text-lg">Login</NavLink></li>
                <li><NavLink to="/register" className="text-lg btn btn-error btn-sm mt-2">Register</NavLink></li>
              </>
            )}

            {/* Theme Toggle in Mobile */}
            <li className="mt-4 border-t pt-4">
              <button onClick={toggleTheme} className="flex items-center gap-3 w-full">
                <span className="text-2xl">{theme === "dark" ? "☀️" : "🌙"}</span>
                <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </li>
          </ul>
        </div>

        <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition">
          🩸 BloodCare
        </Link>
      </div>

      {/* Center - Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6 text-lg">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/donation-requests">Donation Requests</NavLink></li>
          {user && <li><NavLink to="/funding">Funding</NavLink></li>}
        </ul>
      </div>

      {/* Right - Theme + User */}
      <div className="navbar-end flex items-center gap-4">
        {/* Theme Toggle (Desktop) */}
        <button
          onClick={toggleTheme}
          className="btn btn-circle btn-ghost tooltip tooltip-bottom"
          data-tip={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          <span className="text-2xl">{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>

        {/* User Menu */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-12 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
            </label>
            <ul tabIndex={0} className="menu dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-60 z-50">
              <li className="menu-title text-center pb-2">
                <span className="text-lg font-bold">{user?.displayName || "User"}</span>
              </li>
              <li><NavLink to="/dashboard" className="text-lg justify-center">Dashboard</NavLink></li>
              <li><button onClick={logOut} className="text-lg text-error justify-center">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-3">
            <NavLink to="/login" className="btn btn-outline btn-error">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-error text-white">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;