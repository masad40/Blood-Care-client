import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Home,
  Droplet,
  Info,
  Phone,
  HeartHandshake,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      setIsMenuOpen(false);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home, showAlways: true },
    { to: "/donation-requests", label: "Donation Requests", icon: Droplet, showAlways: true },
    { to: "/about", label: "About", icon: Info, showAlways: true },
    { to: "/contact", label: "Contact", icon: Phone, showAlways: true },
    { to: "/funding", label: "Funding", icon: HeartHandshake, loggedInOnly: true },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" 
        : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800"
    } border-b border-red-100 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 ml-2 lg:ml-0">
              <div className="relative">
                <Droplet className="h-10 w-10 text-red-600 dark:text-red-500" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 bg-clip-text text-transparent">
                  BloodCare
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                  Saving Lives Together
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              (!item.loggedInOnly || user) && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800"
                    }`
                  }
                  end={item.to === "/"}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500">
                    <img
                      src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </label>
                
                <div className="dropdown-content menu p-4 shadow-2xl bg-white dark:bg-gray-900 rounded-xl w-64 mt-3 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col items-center pb-4 border-b dark:border-gray-800">
                    <img
                      src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-red-500"
                    />
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.displayName || "Donor"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full text-center">{user?.email}</p>
                  </div>
                  
                  <NavLink 
                    to="/dashboard" 
                    className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 mt-1 w-full rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium btn text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition "
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {navItems.map((item) => (
            (!item.loggedInOnly || user) && (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800'
                  }`
                }
                end={item.to === "/"}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          ))}
          
          {user && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 w-full rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800"
          >
            <span className="flex items-center gap-3">
              {theme === "dark" ? (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;