import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>BloodCare | My Profile</title>
        <meta
          name="description"
          content="View and manage your BloodCare profile – update your information and avatar to help donors recognize you."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-500">
        <div className="card w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              My Profile
            </h1>
            <p className="text-xl text-red-100">
              Manage your account and help save lives
            </p>
          </div>

          <div className="card-body p-8 lg:p-12 -mt-8">
            <div className="flex flex-col items-center mb-10">
              <div className="avatar mb-6">
                <div className="w-32 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-4 shadow-2xl">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/Q3LYhjtx/pngtree-user-icon-png-image-1796659.jpg"
                    }
                    alt="Profile Avatar"
                    className="object-cover"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.displayName || "Anonymous Donor"}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-1">
                {user?.email}
              </p>
              {user?.bloodGroup && (
                <div className="mt-4">
                  <span className="badge badge-error badge-lg text-white font-bold text-xl px-6 py-4">
                    {user.bloodGroup}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/dashboard/updateProfile")}
              className="btn btn-error btn-lg w-full text-xl font-bold py-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
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