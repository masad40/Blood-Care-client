import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// Lucide Icons Import (professional look-এর জন্য)
import {
  Home,
  Droplet,           // Blood/Donation এর জন্য best
  Info,
  Phone,
  HeartHandshake,    // Funding/Help/Donate
  LayoutDashboard,   // যদি dashboard রাখতে চাও (এখন commented)
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Nav items - Dashboard & My Profile হটানো হয়েছে
  const navItems = [
    { to: "/", label: "Home", icon: Home, showAlways: true },
    { to: "/donation-requests", label: "Donation Requests", icon: Droplet, showAlways: true },
    { to: "/about", label: "About", icon: Info, showAlways: true },
    { to: "/contact", label: "Contact", icon: Phone, showAlways: true },
    { to: "/funding", label: "Funding", icon: HeartHandshake, loggedInOnly: true },
  ];

  return (
    <div className="navbar bg-gradient-to-r from-red-50 to-rose-50 
                    dark:from-gray-900 dark:to-gray-800 
                    shadow-lg px-4 sm:px-8 lg:px-16 sticky top-0 z-50 
                    border-b border-red-200/50 dark:border-red-900/50">

      {/* Logo */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-5 shadow-2xl bg-base-100 dark:bg-gray-900 rounded-box w-80">
            {navItems.map((item) => (
              (!item.loggedInOnly || user) && (
                <li key={item.to}>
                  <NavLink to={item.to} className="text-lg py-3 px-4 flex items-center gap-3" end={item.to === "/"}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                </li>
              )
            ))}
            {user && (
              <li className="border-t mt-3 pt-3">
                <button onClick={handleLogout} className="text-error text-lg py-3 px-4 w-full text-left flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            )}
            <li className="border-t mt-3 pt-3">
              <button onClick={toggleTheme} className="flex justify-between w-full text-lg py-3 px-4 items-center gap-3">
                <span className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      Light Mode
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      Dark Mode
                    </>
                  )}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Droplet className="h-10 w-10 text-red-600 dark:text-red-500 animate-pulse hover:animate-none" />
          <div>
            <h1 className="text-3xl font-black text-red-600 dark:text-red-500 tracking-tight">
              BloodCare
            </h1>
            <p className="text-xs text-gray-700 dark:text-gray-400 -mt-1 font-medium">
              Saving Lives Together
            </p>
          </div>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6 lg:gap-8 text-base font-medium">
          {navItems.map((item) => (
            (!item.loggedInOnly || user) && (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-600 dark:text-red-400 border-b-4 border-red-600 pb-1 font-bold flex items-center gap-2"
                      : "hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-2"
                  }
                  end={item.to === "/"}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle text-xl tooltip tooltip-bottom"
          data-tip={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex items-center gap-1">
              <div className="w-11 rounded-full ring-2 ring-red-500 ring-offset-2">
                <img
                  src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                  alt="profile"
                  className="object-cover"
                />
              </div>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </label>

            <ul tabIndex={0} className="dropdown-content menu p-5 shadow-2xl bg-base-100 dark:bg-gray-900 rounded-2xl w-80 mt-3 border">
              <div className="text-center pb-5 border-b dark:border-gray-700">
                <img
                  src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                  alt="profile"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-red-500"
                />
                <p className="font-bold text-xl">{user?.displayName || "Donor"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>

              <li className="mt-3">
                <NavLink to="/dashboard" className="py-3 text-lg flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </NavLink>
              </li>
             
              <li>
                <button onClick={handleLogout} className="text-error py-3 text-lg w-full text-left flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-3">
            <NavLink to="/login" className="btn btn-outline btn-error px-6">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-error text-white px-6 shadow-md">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;