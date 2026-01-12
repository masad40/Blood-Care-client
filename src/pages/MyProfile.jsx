import { useContext, useMemo, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  User, 
  Mail, 
  Shield, 
  Droplet, 
  Edit3, 
  Award,
  Heart
} from "lucide-react";

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

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>BloodCare | My Profile</title>
        <meta
          name="description"
          content="View and manage your BloodCare profile. Keep your information up to date to help save lives."
        />
      </Helmet>

      <div
        className={`min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-500 ${
          fadeIn ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700`}
      >
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Heart className="h-8 w-8" />
              My Profile
            </h1>
            <p className="mt-2 text-lg text-red-100 flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Account information overview
            </p>
          </div>

          {/* BODY */}
          <div className="p-8 lg:p-12 -mt-10 text-center">

            {/* AVATAR */}
            <div className="flex justify-center mb-6 relative">
              <div
                className="w-32 rounded-full ring-4 ring-red-500 ring-offset-4 ring-offset-base-100 shadow-2xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-110 group"
                title="User Avatar"
              >
                <img
                  src={profileData.photo}
                  alt="User avatar"
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -bottom-2 left-58 p-2 bg-red-600 text-white rounded-full shadow-lg">
                <Edit3 className="h-5 w-5" />
              </div>
            </div>

            {/* NAME & EMAIL */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 mb-2">
              <User className="h-7 w-7 text-red-600 dark:text-red-500" />
              {profileData.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              {profileData.email}
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span
                className={`badge bg-red-500 ${
                  ROLE_STYLES[profileData.role] || "badge-ghost"
                } badge-lg text-white font-bold capitalize px-6 py-4 cursor-default
                  transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2`}
                title={`Role: ${profileData.role}`}
              >
                {profileData.role === 'admin' && <Shield className="h-5 w-5" />}
                {profileData.role === 'volunteer' && <User className="h-5 w-5" />}
                {profileData.role === 'donor' && <Heart className="h-5 w-5" />}
                {profileData.role}
              </span>

              {profileData.bloodGroup && (
                <span
                  className="badge bg-red-500 badge-error badge-lg text-white font-bold px-6 py-4 cursor-default
                    transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                  title={`Blood Group: ${profileData.bloodGroup}`}
                >
                  <Droplet className="h-5 w-5" />
                  {profileData.bloodGroup}
                </span>
              )}

              <span
                className="badge bg-gradient-to-r from-amber-500 to-orange-600 badge-lg text-white font-bold px-6 py-4 cursor-default
                  transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                title="Verified Member"
              >
                <Award className="h-5 w-5" />
                Verified
              </span>
            </div>

            {/* ACTION */}
            <button
              onClick={() => navigate("/dashboard/updateProfile")}
              className="mt-12 btn btn-error btn-lg w-full text-xl font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Edit3 className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              Update Profile
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* ADDITIONAL INFO */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl">
                  <div className="inline-flex p-3 bg-red-600 text-white rounded-full mb-3">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Donations</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                  <div className="inline-flex p-3 bg-blue-600 text-white rounded-full mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">36</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lives Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;