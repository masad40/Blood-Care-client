import { useContext, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DEFAULT_AVATAR =
  "https://i.ibb.co/Q3LYhjtx/pngtree-user-icon-png-image-1796659.jpg";

const ROLE_STYLES = {
  admin: "badge-error",
  volunteer: "badge-info",
  user: "badge-success",
  manager: "badge-warning",
};

const Profile = () => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const profileData = useMemo(
    () => ({
      name: user?.displayName || "Anonymous User",
      email: user?.email || "Not available",
      photo: user?.photoURL || DEFAULT_AVATAR,
      bloodGroup: user?.bloodGroup || null,
      role: role || "user",
    }),
    [user, role]
  );
  console.log(user);
  

  return (
    <>
      <Helmet>
        <title>BloodCare | My Profile</title>
        <meta
          name="description"
          content="View and manage your BloodCare profile. Keep your information up to date to help save lives."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-500">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
            <p className="mt-2 text-lg text-red-100">
              Account information overview
            </p>
          </div>

          {/* BODY */}
          <div className="p-8 lg:p-12 -mt-10 text-center">

            {/* AVATAR */}
            <div className="flex justify-center mb-6">
              <div className="w-32 rounded-full ring ring-red-500 ring-offset-4 ring-offset-base-100 shadow-xl overflow-hidden">
                <img
                  src={profileData.photo}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* NAME & EMAIL */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profileData.name}
            </h2>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
              {profileData.email}
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <span
                className={`badge bg-red-500 ${
                  ROLE_STYLES[profileData.role] || "badge-ghost"
                } badge-lg text-white font-bold capitalize px-6 py-4`}
              >
                {profileData.role}
              </span>

              {profileData.bloodGroup && (
                <span className="badge bg-red-500 badge-error badge-lg text-white font-bold px-6 py-4">
                  {profileData.bloodGroup}
                </span>
              )}
            </div>

            {/* ACTION */}
            <button
              onClick={() => navigate("/dashboard/updateProfile")}
              className="mt-10 btn btn-error btn-lg w-full text-xl font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
