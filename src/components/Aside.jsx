import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  Droplet,
  PlusCircle,
  User,
  Users,
  List,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logOut } = useContext(AuthContext);
  const location = useLocation();

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
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Role-based menu items with Lucide icons
  const menuItems = {
    donor: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      { name: "My Requests", path: "/dashboard/my-donation-requests", icon: Droplet },
      { name: "Create Request", path: "/dashboard/createRequest", icon: PlusCircle },
      { name: "Profile", path: "/dashboard/profile", icon: User },
    ],
    volunteer: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      { name: "All Requests", path: "/dashboard/all-blood-donation-request", icon: List },
      { name: "Profile", path: "/dashboard/profile", icon: User },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      { name: "All Users", path: "/dashboard/all-users", icon: Users },
      { name: "All Requests", path: "/dashboard/all-blood-donation-request", icon: List },
      { name: "Profile", path: "/dashboard/profile", icon: User },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.donor;

  return (
    <>
      <Helmet>
        <title>BloodCare Dashboard | {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}</title>
        <meta name="description" content="Manage blood donation requests, profile and more in BloodCare dashboard." />
        <meta name="theme-color" content={theme === "dark" ? "#991b1b" : "#dc2626"} />
      </Helmet>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-red-900 to-red-950 text-white 
                    transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">

          {/* Logo Header */}
          <div className="p-6 border-b border-red-800/50">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3"
            >
              <Droplet className="h-8 w-8 text-red-400" />
              <div>
                <h2 className="text-2xl font-bold">BloodCare</h2>
                <p className="text-sm text-red-300/80">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {currentMenu.map((item) => {
              const isActive = location.pathname === item.path || 
                              location.pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200
                    ${isActive 
                      ? "bg-red-700/90 text-white shadow-md" 
                      : "hover:bg-red-800/50 text-red-100 hover:text-white"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-3.5 rounded-xl w-full mt-6
                         text-red-100 hover:bg-red-800/50 hover:text-white transition-all duration-200"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </nav>

          {/* User Info & Logout */}
          <div className="p-6 border-t border-red-800/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-12 rounded-full ring-2 ring-red-500/50">
                  <img
                    src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                    alt="User avatar"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.displayName || user?.name || "User"}</p>
                <p className="text-sm text-red-300/80 capitalize">{role || "donor"}</p>
              </div>
            </div>

            <button
              onClick={logOut}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl 
                         font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Aside;