import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import Aside from "../components/Aside";

const DashboardLayout = () => {
  return (
    <>
      <Helmet>
        <title>BloodCare | Dashboard</title>
        <meta name="description" content="Manage blood donation requests, profile, and more in BloodCare dashboard." />
      </Helmet>

      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Aside />

        <main className="flex-1 lg:ml-0 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;